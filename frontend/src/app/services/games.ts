import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../../constant";
import type { Game } from "../../types";

export const gamesApiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Games"],
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    prepareHeaders: (headers) => {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDashboardGames: builder.query({
      query: (arg) => {
        const { page } = arg;
        return {
          url: `/api/games?populate[thumbnail]=true&populate[images]=true&populate[genres]=true&videoTrailer=true&pagination[page]=${page}&pagination[pageSize]=10`,
        };
      },
      transformResponse: (response) => {
        console.log("Raw API Response:", response);
        return response;
      },
      providesTags: (result) =>
        result?.data && Array.isArray(result.data)
          ? [
              ...result.data.map(({ id }: { id: number | string }) => ({
                type: "Games",
                id,
              })),
              { type: "Games", id: "LIST" },
            ]
          : [{ type: "Games", id: "LIST" }],
    }),

    updateGame: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/api/games/${id}`,
        method: "PUT",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      async onQueryStarted({ id, payload }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          gamesApiSlice.util.updateQueryData(
            "getDashboardGames",
            { page: 1 },
            (draft) => {
              const gameIndex = draft.data.findIndex(
                (game: Game) => game.documentId === id
              );
              if (gameIndex !== -1) {
                draft.data[gameIndex] = {
                  ...draft.data[gameIndex],
                  ...payload.data,
                };
              }
            }
          )
        );
        try {
          const { data } = await queryFulfilled;
          // Additional cache update for file fields if needed
          dispatch(
            gamesApiSlice.util.updateQueryData(
              "getDashboardGames",
              { page: 1 },
              (draft) => {
                const gameIndex = draft.data.findIndex(
                  (game: Game) => game.documentId === id
                );
                if (gameIndex !== -1) {
                  draft.data[gameIndex] = {
                    ...draft.data[gameIndex],
                    ...data, // Update with full response if it includes file data
                  };
                }
              }
            )
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ({ id }) => [
        { type: "Games", id },
        { type: "Games", id: "LIST" },
      ],
    }),

    deleteGame: builder.mutation({
      query: (id) => ({
        url: `/api/games/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [{ type: "Games", id: "LIST" }],
    }),
  }),
});

export const {
  useGetDashboardGamesQuery,
  useDeleteGameMutation,
  useUpdateGameMutation,
} = gamesApiSlice;
