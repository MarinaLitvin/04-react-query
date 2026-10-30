import axios from "axios";
import type { Movie } from "../types/movie";

interface FetchMoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export async function fetchMovies(
  query: string,
  page: number,
): Promise<FetchMoviesResponse> {
  try {
    const response = await axios.get<FetchMoviesResponse>(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          query,
          page,
        },
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("TMDB error:", error.response?.data);
    }

    throw error;
  }
}
