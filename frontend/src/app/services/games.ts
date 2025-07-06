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
          url: `/api/games?populate[thumbnail]=true&populate[images]=true&populate[genres]=true&pagination[page]=${page}&pagination[pageSize]=10`,
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
      query: ({ id, data, hasFiles = false }) => {
        console.log("Update mutation - hasFiles:", hasFiles);
        console.log("Data:", data);

        if (hasFiles) {
          // For FormData with files
          return {
            url: `/api/games/${id}`,
            method: "PUT",
            body: data, // Should be FormData
            headers: {
              Authorization: `Bearer ${token}`,
              // Let browser set Content-Type for FormData
            },
          };
        } else {
          // For regular JSON updates
          return {
            url: `/api/games/${id}`,
            method: "PUT",
            body: { data },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          };
        }
      },
      transformResponse: (response) => {
        console.log("Update Game Response:", response);
        return response;
      },
      async onQueryStarted(
        { id, data, hasFiles },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          gamesApiSlice.util.updateQueryData(
            "getDashboardGames",
            { page: 1 },
            (draft) => {
              const gameIndex = draft.data.findIndex(
                (game: Game) => game.documentId === id
              );
              if (gameIndex !== -1) {
                // Extract the actual data from FormData or use directly
                const updateData =
                  hasFiles && data instanceof FormData
                    ? JSON.parse(data.get("data") as string)
                    : data;
                draft.data[gameIndex] = {
                  ...draft.data[gameIndex],
                  ...updateData,
                };
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ({ id }) => [
        { type: "Games", id: "LIST" },
        { type: "Games", id },
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
