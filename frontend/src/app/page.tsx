// src/app/page.tsx

import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MyPlai'z — Jeux en ligne",
  description: "Des jeux créés et hébergés ici — pas d'algorithme, pas de publicité, juste du fun.",
}

const GAMES = [
  {
    slug: "pendu",
    name: "Pendu",
    emoji: "🎯",
    tag: "Multijoueur",
    badge: { label: "Populaire", type: "hot" },
    color: "#12103A",
    available: true,
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A14] text-[#F5F5F5] font-sans overflow-x-hidden">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[#7C3AFF]/15">
        <p className="font-black text-2xl tracking-tight" style={{ fontFamily: "var(--font-geist-sans)" }}>
          Myplai<span className="text-[#7C3AFF]">&apos;z</span>
        </p>
        <ul className="hidden sm:flex gap-8 list-none">
          <li>
            <a href="#jeux" className="text-white/50 hover:text-white text-sm font-medium transition-colors">
              Jeux
            </a>
          </li>
          <li>
            <a href="#" className="text-white/50 hover:text-white text-sm font-medium transition-colors">
              À propos
            </a>
          </li>
        </ul>
        <Link
          href="/pendu"
          className="bg-[#7C3AFF] hover:bg-[#6425e0] text-white text-sm font-medium px-5 py-2 rounded-md transition-colors"
        >
          Jouer maintenant
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 pt-20 pb-16 text-center">
        <span className="inline-block text-[#00E5B4] text-xs font-medium tracking-[0.12em] uppercase mb-6">
          Plateforme indépendante · 100% maison
        </span>
        <h1
          className="font-black leading-[0.95] tracking-tight mb-6"
          style={{
            fontSize: "clamp(3rem, 8vw, 5.5rem)",
            letterSpacing: "-0.03em",
          }}
        >
          Joue.<br />
          <span className="text-[#7C3AFF]">Gagne.</span><br />
          <span className="text-[#00E5B4]">Rejoue.</span>
        </h1>
        <p className="text-white/50 text-lg leading-relaxed max-w-md mx-auto mb-10">
          Des jeux créés et hébergés ici — pas d&apos;algorithme, pas de publicité, juste du fun.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="#jeux"
            className="bg-[#7C3AFF] hover:bg-[#6425e0] text-white px-8 py-3.5 rounded-lg font-medium text-base transition-all hover:-translate-y-px"
          >
            Voir les jeux
          </a>
          <a
            href="#"
            className="border border-white/20 hover:border-white/50 text-white/70 hover:text-white px-8 py-3.5 rounded-lg font-medium text-base transition-colors"
          >
            Comment ça marche ?
          </a>
        </div>
      </section>

      <div className="h-px bg-white/[0.06] mx-8" />

      {/* Grille jeux */}
      <section id="jeux" className="max-w-5xl mx-auto px-8 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-black text-2xl tracking-tight">Jeux disponibles</h2>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {GAMES.map(game => (
            <Link
              key={game.slug}
              href={`/${game.slug}`}
              className="group bg-[#1A1A2E] border border-white/[0.06] rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[#7C3AFF]/40"
            >
              {/* Thumbnail */}
              <div
                className="w-full relative flex items-center justify-center text-5xl overflow-hidden"
                style={{ aspectRatio: "4/3", background: game.color }}
              >
                {/* Effet scan au hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
                    animation: "none",
                  }}
                />
                {game.badge && (
                  <span className={`absolute top-2.5 left-2.5 text-[0.65rem] tracking-wider uppercase px-2 py-0.5 rounded font-medium ${
                    game.badge.type === "hot"
                      ? "bg-[rgba(0,229,180,0.15)] text-[#00E5B4]"
                      : game.badge.type === "new"
                      ? "bg-[#7C3AFF] text-white"
                      : "bg-[rgba(124,58,255,0.15)] text-[#a78bfa]"
                  }`}>
                    {game.badge.label}
                  </span>
                )}
                {game.emoji}
              </div>

              {/* Body */}
              <div className="px-4 py-3">
                <p className="font-black text-base mb-1">{game.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-xs uppercase tracking-wider">{game.tag}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="h-px bg-white/[0.06] mx-8" />

      {/* CTA bas */}
      <section className="max-w-5xl mx-auto px-8 py-14 text-center">
        <p className="font-black text-2xl tracking-tight mb-3">
          Envie de jouer à quelque chose de précis ?
        </p>
        <p className="text-white/45 text-base mb-8">
          Tous les jeux sont disponibles sans inscription.
        </p>
        <Link
          href="/pendu"
          className="inline-block bg-[#7C3AFF] hover:bg-[#6425e0] text-white px-8 py-3.5 rounded-lg font-medium text-base transition-all hover:-translate-y-px"
        >
          Jouer au Pendu
        </Link>
      </section>

    </main>
  )
}