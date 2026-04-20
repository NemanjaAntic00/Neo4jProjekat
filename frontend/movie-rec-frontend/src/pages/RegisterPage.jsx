import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film } from "lucide-react";
import { registerUser } from "../api/authApi";

const genres = [
  "Action",
  "Sci-Fi",
  "Drama",
  "Comedy",
  "Thriller",
  "Romance",
  "Adventure",
  "Fantasy",
];

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function toggleGenre(genre) {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      !formData.fullName.trim() ||
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Popuni sva polja.");
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        favoriteGenres: selectedGenres,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("fullName", data.fullName);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registracija nije uspela.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-10">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-2xl lg:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-indigo-500/20 p-10 lg:block">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-2">
                <Film className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">MovieRec</h1>
                <p className="text-sm text-zinc-400">
                  Neo4j Movie Recommendation System
                </p>
              </div>
            </div>

            <div className="mt-16">
              <p className="mb-3 text-sm uppercase tracking-[0.25em] text-zinc-400">
                Create account
              </p>
              <h2 className="text-4xl font-bold leading-tight">
                Napravi nalog i odmah postavi osnovu za prve preporuke.
              </h2>
              <p className="mt-6 max-w-md text-zinc-300">
                Izbor omiljenih žanrova pri registraciji pomaže sistemu da
                korisniku već od početka generiše smislenije preporuke.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <Link
              to="/"
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              ← Nazad na početnu
            </Link>

            <div className="mt-8">
              <h2 className="text-3xl font-bold">Register</h2>
              <p className="mt-2 text-zinc-400">Kreiraj novi nalog</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Full name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Unesi ime i prezime"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Unesi username"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Unesi email"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Unesi password"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm text-zinc-300">
                  Omiljeni žanrovi
                </label>
                <div className="flex flex-wrap gap-3">
                  {genres.map((genre) => {
                    const selected = selectedGenres.includes(genre);

                    return (
                      <button
                        type="button"
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          selected
                            ? "border-white bg-white text-zinc-950"
                            : "border-white/15 bg-white/5 text-white hover:border-white/30"
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-white px-4 py-3 font-semibold text-zinc-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-sm text-zinc-400">
              Već imaš nalog?{" "}
              <Link to="/login" className="font-medium text-white">
                Prijavi se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
