import { useCallback, useState, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

import toast, { Toaster } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import styles from "./App.module.css";

// React Paginate import for Vite 8+
type ModuleWithDefault<T> = {
  default: T;
};

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Fetch movies with TanStack Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: Boolean(query),
  });

  // Movies from backend response
  const movies = data?.results ?? [];

  // Total number of pages
  const totalPages = data?.total_pages ?? 0;

  // Handle search
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    setSelectedMovie(null);
  };

  console.log("data:", data);
  console.log("totalPages:", totalPages);
  console.log("movies:", movies.length);

  // Show notification when no movies are found
  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  // Select movie
  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  // Close modal
  const handleClose = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <div className={styles.app}>
      <Toaster position="top-right" />

      <SearchBar onSubmit={handleSearch} />

      <main>
        {isLoading && <Loader />}

        {isError && !isLoading && <ErrorMessage />}

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={styles.pagination}
            activeClassName={styles.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}

        {!isLoading && !isError && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleSelect} />
        )}

        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleClose} />
        )}
      </main>
    </div>
  );
}
