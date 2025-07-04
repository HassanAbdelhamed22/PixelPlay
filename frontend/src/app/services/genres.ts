import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../../constant";

export const genresApiSlice = createApi({
  reducerPath: "genresApi",
  tagTypes: ["Genres"],
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
    getGenres: builder.query({
      query: () => ({
        url: `/api/genres`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: number | string }) => ({
                type: "Genres",
                id,
              })),
              { type: "Genres", id: "LIST" },
            ]
          : [{ type: "Genres", id: "LIST" }],
    }),
  }),
});

export const { useGetGenresQuery } = genresApiSlice;
