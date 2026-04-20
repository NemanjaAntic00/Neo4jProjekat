import { Link } from "react-router-dom";
import { Film, Users, Sparkles, ArrowRight, Star } from "lucide-react";

const features = [
  {
    icon: Film,
    title: "Preporuke po žanru",
    description:
      "Sistem analizira omiljene žanrove korisnika i predlaže filmove koji se najbolje uklapaju u njegova interesovanja.",
  },
  {
    icon: Users,
    title: "Socijalne preporuke",
    description:
      "Prikaži filmove koje gledaju i visoko ocenjuju prijatelji iz tvog socijalnog grafa.",
  },
  {
    icon: Sparkles,
    title: "Collaborative Filtering",
    description:
      "Pronalazi korisnike sa sličnim ukusom i preporučuje filmove koje su oni ocenili visoko.",
  },
];

const previewCards = [
  {
    title: "Interstellar",
    tag: "Po žanru",
    reason: "Preporučeno jer voliš Sci-Fi i Adventure.",
  },
  {
    title: "John Wick",
    tag: "Prijatelji",
    reason: "Gledali Marko i Nikola iz tvoje mreže.",
  },
  {
    title: "Shutter Island",
    tag: "Slični korisnici",
    reason: "Korisnici sa sličnim ukusom su ga ocenili visoko.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.14),transparent_28%)]" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-2">
              <Film className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-wide">MovieRec</h1>
              <p className="text-sm text-zinc-400">
                Neo4j Movie Recommendation System
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-white/30 hover:bg-white/5"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:opacity-90"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
              <Star className="h-4 w-4" />
              Personalizovane preporuke zasnovane na graf bazi
            </div>

            <h2 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Otkrij filmove na osnovu svojih preferencija, prijatelja i
              korisnika sa sličnim ukusom.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Aplikacija koristi Neo4j da poveže korisnike, filmove, žanrove i
              društvene veze, a zatim generiše objašnjive preporuke kroz tri
              različita pristupa.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-base font-semibold text-zinc-950 transition hover:opacity-90"
              >
                Započni
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-white/15 px-6 py-3 text-base font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
              >
                Prijavi se
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-2xl font-bold">3</div>
                <p className="mt-2 text-sm text-zinc-400">nivoa preporuka</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-2xl font-bold">Neo4j</div>
                <p className="mt-2 text-sm text-zinc-400">
                  socijalni graf i relacije
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-2xl font-bold">Explainable</div>
                <p className="mt-2 text-sm text-zinc-400">
                  jasan razlog preporuke
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur">
            <div className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Dashboard preview</p>
                  <h3 className="text-2xl font-semibold">Top picks for you</h3>
                </div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Live insights
                </span>
              </div>

              <div className="space-y-4">
                {previewCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-3xl border border-white/10 bg-zinc-950/80 p-4 transition hover:border-white/20"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h4 className="text-lg font-semibold">{card.title}</h4>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">
                        {card.tag}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-zinc-400">
                      {card.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 sm:py-14">
          <div className="mb-10 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
              How it works
            </p>
            <h3 className="mt-3 text-3xl font-bold sm:text-4xl">
              Tri nivoa inteligentnih preporuka
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              Svaki korisnik dobija preporuke kroz kombinaciju ličnih
              preferencija, društvenih veza i ponašanja korisnika sa sličnim
              ukusom.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="mb-5 inline-flex rounded-2xl bg-white/8 p-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-semibold">{feature.title}</h4>
                  <p className="mt-3 leading-7 text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 pt-8">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-white/[0.08] to-white/[0.03] p-8 text-center sm:p-10">
            <h3 className="text-3xl font-bold">
              Spreman da vidiš personalizovane preporuke?
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-300">
              Registruj se, izaberi omiljene žanrove i testiraj kako sistem
              kombinuje više izvora podataka da bi generisao relevantne
              preporuke filmova.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="rounded-2xl bg-white px-6 py-3 font-semibold text-zinc-950 transition hover:opacity-90"
              >
                Kreiraj nalog
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
              >
                Već imam nalog
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-sm text-zinc-500">
        © 2026 MovieRec — Sistem za preporuku filmova zasnovan na socijalnom
        grafu i korisničkim preferencijama.
      </footer>
    </div>
  );
}
