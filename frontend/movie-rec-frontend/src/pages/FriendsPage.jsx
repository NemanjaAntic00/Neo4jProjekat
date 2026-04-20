import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film, LogOut, User, Search, Users, UserPlus } from "lucide-react";
import { fetchFriends, searchUsers, addFriend } from "../api/friendApi";

export default function FriendsPage() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const fullName = localStorage.getItem("fullName");

  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadFriends();
  }, [navigate]);

  async function loadFriends() {
    try {
      setLoadingFriends(true);
      setError("");
      const data = await fetchFriends();
      setFriends(data);
    } catch (err) {
      setError(err.message || "Ne mogu da učitam prijatelje.");
    } finally {
      setLoadingFriends(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      setError("");
      const data = await searchUsers(searchQuery.trim());
      setResults(data);
    } catch (err) {
      setError(err.message || "Greška pri pretrazi.");
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleAddFriend(friendUsername) {
    try {
      setMessage("");
      setError("");
      const result = await addFriend(friendUsername);
      setMessage(result);
      setResults((prev) =>
        prev.filter((user) => user.username !== friendUsername),
      );
      await loadFriends();
    } catch (err) {
      setError(err.message || "Ne mogu da dodam prijatelja.");
    }
  }

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
              <p className="text-sm text-zinc-400">Friends</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Dashboard
            </Link>

            <Link
              to="/movies"
              className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Movies
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
            Friends
          </p>
          <h2 className="mt-3 text-4xl font-bold">Upravljanje prijateljima</h2>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Pretraži korisnike i dodaj ih kao prijatelje. Social recommendations
            će koristiti WATCHED filmove tvojih prijatelja.
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

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-5 flex items-center gap-3">
              <Users className="h-5 w-5 text-zinc-300" />
              <h3 className="text-2xl font-bold">My Friends</h3>
            </div>

            {loadingFriends ? (
              <p className="text-zinc-400">Učitavanje prijatelja...</p>
            ) : friends.length === 0 ? (
              <p className="text-zinc-400">Još nemaš dodatih prijatelja.</p>
            ) : (
              <div className="space-y-4">
                {friends.map((friend) => (
                  <div
                    key={friend.username}
                    className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4"
                  >
                    <h4 className="text-lg font-semibold">
                      {friend.fullName || friend.username}
                    </h4>
                    <p className="text-sm text-zinc-400">@{friend.username}</p>

                    {friend.favoriteGenres?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {friend.favoriteGenres.map((genre, index) => (
                          <span
                            key={`${genre}-${index}`}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-5 flex items-center gap-3">
              <Search className="h-5 w-5 text-zinc-300" />
              <h3 className="text-2xl font-bold">Find Users</h3>
            </div>

            <form onSubmit={handleSearch} className="mb-6 flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username or full name..."
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-white/30"
              />
              <button
                type="submit"
                className="rounded-2xl bg-white px-5 py-3 font-semibold text-zinc-950 transition hover:opacity-90"
              >
                Search
              </button>
            </form>

            {searchLoading ? (
              <p className="text-zinc-400">Pretraga u toku...</p>
            ) : results.length === 0 ? (
              <p className="text-zinc-400">Nema rezultata pretrage.</p>
            ) : (
              <div className="space-y-4">
                {results.map((user) => (
                  <div
                    key={user.username}
                    className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-semibold">
                          {user.fullName || user.username}
                        </h4>
                        <p className="text-sm text-zinc-400">
                          @{user.username}
                        </p>

                        {user.favoriteGenres?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {user.favoriteGenres.map((genre, index) => (
                              <span
                                key={`${genre}-${index}`}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddFriend(user.username)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:opacity-90"
                      >
                        <UserPlus className="h-4 w-4" />
                        Add Friend
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
