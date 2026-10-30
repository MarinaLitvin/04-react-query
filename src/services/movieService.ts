import axios from "axios";
import type { Movie } from "../types/movie";

interface FetchMoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

console.log("Token loaded:", Boolean(ACCESS_TOKEN));
console.log("Token length:", ACCESS_TOKEN?.length);

export async function fetchMovies(query: string): Promise<Movie[]> {
  try {
    const response = await axios.get<FetchMoviesResponse>(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          query,
        },
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      },
    );

    return response.data.results;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("TMDB error:", error.response?.data);
    }

    throw error;
  }
}
