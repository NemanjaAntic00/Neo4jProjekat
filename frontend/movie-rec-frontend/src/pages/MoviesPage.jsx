import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film, LogOut, User, Eye, Star } from "lucide-react";
import { fetchAllMovies, markMovieAsWatched, rateMovie } from "../api/movieApi";

export default function MoviesPage() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const fullName = localStorage.getItem("fullName");

  const [movies, setMovies] = useState([]);
  const [ratings, setRatings] = useState({});
  const [hoverRatings, setHoverRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadMovies();
  }, [navigate]);

  async function loadMovies() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAllMovies();
      setMovies(data);

      const initialRatings = {};
      data.forEach((movie) => {
        if (movie.userRating) {
          initialRatings[movie.movieId] = Number(movie.userRating);
        }
      });
      setRatings(initialRatings);
    } catch (err) {
      setError(err.message || "Greška pri učitavanju filmova.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");
    navigate("/login");
  }

  function setSelectedRating(movieId, value) {
    setRatings((prev) => ({
      ...prev,
      [movieId]: value,
    }));
  }

  async function handleWatch(movieId) {
    try {
      setMessage("");
      setError("");
      const result = await markMovieAsWatched(movieId);
      setMessage(result);
      await loadMovies();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRate(movieId) {
    try {
      setMessage("");
      setError("");

      const score = Number(ratings[movieId]);

      if (!score || score < 1 || score > 5) {
        setError("Ocena mora biti između 1 i 5.");
        return;
      }

      const result = await rateMovie(movieId, score);
      setMessage(result);
      await loadMovies();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-2">
              <Film className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">MovieRec</h1>
              <p className="text-sm text-zinc-400">Movies Library</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Dashboard
            </Link>

            <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 sm:flex">
              <User className="h-4 w-4" />
              {fullName || username}
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-8 rounded-[32px] border border-white/10 bg-white/[0.04] p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
            Movies
          </p>
          <h2 className="mt-3 text-4xl font-bold">Pregled filmova</h2>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Ovde korisnik može da označi da je gledao film i da mu dodeli ocenu.
            Sistem pamti stanje iz baze i koristi ga za poboljšanje preporuka.
          </p>
        </section>

        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-zinc-300">
            Učitavanje filmova...
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {movies.map((movie) => {
              const selectedRating = ratings[movie.movieId] || 0;
              const hoverRating = hoverRatings[movie.movieId] || 0;
              const activeStars = hoverRating || selectedRating;

              return (
                <div
                  key={movie.movieId}
                  className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">{movie.title}</h3>
                      <p className="mt-1 text-sm text-zinc-400">{movie.year}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {movie.watched && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                          <Eye className="h-3 w-3" />
                          Watched
                        </span>
                      )}

                      {movie.userRating && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
                          <Star className="h-3 w-3 fill-current" />
                          Rated: {movie.userRating}/5
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <button
                      onClick={() => handleWatch(movie.movieId)}
                      disabled={movie.watched}
                      className="w-full rounded-2xl border border-white/15 px-4 py-3 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {movie.watched ? "Already watched" : "Mark as watched"}
                    </button>

                    <div>
                      <p className="mb-3 text-sm text-zinc-300">
                        {movie.userRating
                          ? "Update your rating"
                          : "Rate this movie"}
                      </p>

                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((starValue) => {
                          const active = starValue <= activeStars;

                          return (
                            <button
                              key={starValue}
                              type="button"
                              onMouseEnter={() =>
                                setHoverRatings((prev) => ({
                                  ...prev,
                                  [movie.movieId]: starValue,
                                }))
                              }
                              onMouseLeave={() =>
                                setHoverRatings((prev) => ({
                                  ...prev,
                                  [movie.movieId]: 0,
                                }))
                              }
                              onClick={() =>
                                setSelectedRating(movie.movieId, starValue)
                              }
                              className="transition hover:scale-110"
                            >
                              <Star
                                className={`h-7 w-7 ${
                                  active
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-zinc-500"
                                }`}
                              />
                            </button>
                          );
                        })}

                        <span className="ml-2 text-sm text-zinc-400">
                          {selectedRating ? `${selectedRating}/5` : "No rating"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRate(movie.movieId)}
                        className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:opacity-90"
                      >
                        {movie.userRating ? "Update rating" : "Save rating"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
