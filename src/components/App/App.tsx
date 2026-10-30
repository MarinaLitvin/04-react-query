import { useCallback, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import styles from "./App.module.css";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    setMovies([]);
    setSelectedMovie(null);
    setIsLoading(true);
    setIsError(false);

    try {
      const result = await fetchMovies(query);

      if (result.length === 0) {
        toast.error("No movies found for your request.");
      }

      setMovies(result);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

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
