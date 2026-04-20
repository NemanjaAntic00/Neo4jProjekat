import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film } from "lucide-react";
import { loginUser } from "../api/authApi";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Unesi username i password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("fullName", data.fullName);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Prijava nije uspela.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-2xl lg:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-indigo-500/20 via-zinc-900 to-rose-500/10 p-10 lg:block">
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
                Welcome back
              </p>
              <h2 className="text-4xl font-bold leading-tight">
                Prijavi se i pregledaj personalizovane preporuke filmova.
              </h2>
              <p className="mt-6 max-w-md text-zinc-300">
                Nakon prijave bićeš preusmeren na dashboard sa preporukama po
                žanru, prijateljima i korisnicima sa sličnim ukusom.
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
              <h2 className="text-3xl font-bold">Login</h2>
              <p className="mt-2 text-zinc-400">Prijavi se na svoj nalog</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-sm text-zinc-400">
              Nemaš nalog?{" "}
              <Link to="/register" className="font-medium text-white">
                Registruj se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
