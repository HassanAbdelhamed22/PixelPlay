import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../../constant";

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
      providesTags: ["Games"],
    }),
    deleteGame: builder.mutation({
      query: (id) => ({
        url: `/api/games/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useGetDashboardGamesQuery, useDeleteGameMutation } =
  gamesApiSlice;
