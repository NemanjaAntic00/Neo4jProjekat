import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchGenreRecommendations,
  fetchSocialRecommendations,
  fetchCollaborativeRecommendations,
} from "../api/recommendationApi";
import { Film, LogOut, User, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const fullName = localStorage.getItem("fullName");

  const [genreRecommendations, setGenreRecommendations] = useState([]);
  const [socialRecommendations, setSocialRecommendations] = useState([]);
  const [collaborativeRecommendations, setCollaborativeRecommendations] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    async function loadRecommendations() {
      try {
        setLoading(true);
        setError("");

        const [genreData, socialData, collaborativeData] = await Promise.all([
          fetchGenreRecommendations(),
          fetchSocialRecommendations(),
          fetchCollaborativeRecommendations(),
        ]);

        setGenreRecommendations(genreData);
        setSocialRecommendations(socialData);
        setCollaborativeRecommendations(collaborativeData);
      } catch (err) {
        setError(err.message || "Ne mogu da učitam preporuke.");
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");
    navigate("/login");
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
              <p className="text-sm text-zinc-400">Recommendation Dashboard</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/movies"
              className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Movies
            </Link>

            <Link
              to="/friends"
              className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Friends
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
        <section className="mb-10 rounded-[32px] border border-white/10 bg-white/[0.04] p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
            Dashboard
          </p>
          <h2 className="mt-3 text-4xl font-bold">
            Welcome, {fullName || username}
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Ovde su tvoje personalizovane preporuke generisane na osnovu
            omiljenih žanrova, aktivnosti prijatelja i korisnika sa sličnim
            ukusom.
          </p>
        </section>

        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-zinc-300">
            Učitavanje preporuka...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-10">
            <RecommendationSection
              title="Preporuke po žanru"
              subtitle="Filmovi koji odgovaraju tvojim preferiranim žanrovima"
              items={genreRecommendations}
              emptyMessage="Nema dostupnih genre preporuka."
              variant="genre"
            />

            <RecommendationSection
              title="Preporuke od prijatelja"
              subtitle="Filmovi koje gledaju ili preporučuju tvoji prijatelji"
              items={socialRecommendations}
              emptyMessage="Nema dostupnih socijalnih preporuka."
              variant="social"
            />

            <RecommendationSection
              title="Slični korisnici su voleli"
              subtitle="Collaborative filtering preporuke na osnovu sličnog ukusa"
              items={collaborativeRecommendations}
              emptyMessage="Nema dostupnih collaborative preporuka."
              variant="collaborative"
            />
          </div>
        )}
      </main>
    </div>
  );
}

function RecommendationSection({
  title,
  subtitle,
  items,
  emptyMessage,
  variant,
}) {
  return (
    <section>
      <div className="mb-5">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-2 text-zinc-400">{subtitle}</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-zinc-400">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={`${item.recommendedMovie}-${index}`}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-white/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xl font-semibold">
                    {item.recommendedMovie}
                  </h4>
                  <p className="mt-1 text-sm text-zinc-400">{item.year}</p>
                </div>

                <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-zinc-300">
                  Score: {item.score}
                </span>
              </div>

              <div className="mt-5">
                {variant === "collaborative" ? (
                  <>
                    <p className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                      Why this was recommended
                    </p>

                    <p className="text-sm leading-6 text-zinc-400">
                      Recommended because similar users liked this movie.
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.reasons?.map((reason, i) => (
                        <span
                          key={`${reason}-${i}`}
                          className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-300"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mb-2 text-sm font-medium text-zinc-300">
                      Razlozi preporuke
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.reasons?.map((reason, i) => (
                        <span
                          key={`${reason}-${i}`}
                          className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-300"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
