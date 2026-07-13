// src/app/page.tsx

import Link from "next/link"
import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "MyPlai'z — Jeux en ligne",
  description: "Des jeux créés et hébergés ici — pas d'algorithme, pas de publicité, juste du fun.",
}

const GAMES: {
  slug: string
  name: string
  image: string | null
  emoji?: string
  color: string
  available: boolean
}[] = [
  {
    slug: "pendu",
    name: "Pendu",
    image: "/images/icone_pendu.png",
    color: "#12103A",
    available: true,
  },
  {
    slug: "dames",
    name: "Dames",
    image: null,
    emoji: "⬛",
    color: "#0E2030",
    available: false,
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A14] text-[#F5F5F5] font-sans overflow-x-hidden">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[#7C3AFF]/15">
        <p className="font-black text-2xl tracking-tight">
          Myplai<span className="text-[#7C3AFF]">&apos;z</span>
        </p>
        <ul className="hidden sm:flex gap-8 list-none">
          <li>
            <Link
              href="#jeux"
              className="text-white/50 hover:text-white text-sm font-medium transition-colors relative group"
            >
              Jeux
              <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-px bg-[#7C3AFF] transition-all duration-300" />
            </Link>
          </li>
          <li>
            <Link href="/apropos" className="text-white/50 hover:text-white text-sm font-medium transition-colors relative group">
              A propos
              <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-px bg-[#7C3AFF] transition-all duration-300" />
            </Link>
          </li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 pt-20 pb-16 text-center">
        <span className="inline-block text-[#00E5B4] text-xs font-medium tracking-[0.12em] uppercase mb-6">
          Plateforme independante · 100% maison
        </span>
        <h1
          className="font-black leading-[0.95] tracking-tight mb-6"
          style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", letterSpacing: "-0.03em" }}
        >
          Joue.<br />
          <span className="text-[#7C3AFF]">Gagne.</span><br />
          <span className="text-[#00E5B4]">Rejoue.</span>
        </h1>
        <p className="text-white/50 text-lg leading-relaxed max-w-md mx-auto">
          Des jeux crees et heberges ici — pas d&apos;algorithme, pas de publicite, juste du fun.
        </p>
      </section>

      <div className="h-px bg-white/[0.06] mx-8" />

      {/* Grille jeux */}
      <section id="jeux" className="max-w-5xl mx-auto px-8 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-black text-2xl tracking-tight">Jeux disponibles</h2>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {GAMES.map(game => {
            const card = (
              <div className={`group bg-[#1A1A2E] border rounded-xl overflow-hidden transition-all duration-200 ${
                game.available
                  ? "border-white/[0.06] hover:-translate-y-1 hover:border-[#7C3AFF]/40 cursor-pointer"
                  : "border-white/[0.04] opacity-50 cursor-default"
              }`}>
                <div
                  className="w-full relative flex items-center justify-center overflow-hidden"
                  style={{ aspectRatio: "1/1", background: game.color }}
                >
                  {game.available && (
                    <div
                      className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)" }}
                    />
                  )}
                  {game.image ? (
                    <Image
                      src={game.image}
                      alt={game.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-5xl">{game.emoji ?? ""}</span>
                  )}
                  {!game.available && (
                    <span className="absolute bottom-2.5 left-2.5 z-20 text-[0.65rem] tracking-wider uppercase px-2 py-0.5 rounded font-medium bg-white/5 text-white/30">
                      Bientot
                    </span>
                  )}
                </div>
                <div className="px-4 py-3">
                  <p className="font-black text-base">{game.name}</p>
                </div>
              </div>
            )

            return (
              <Link key={game.slug} href={`/${game.slug}`}>
                {card}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] mt-8">
        <div className="max-w-5xl mx-auto px-8 py-10 flex items-center justify-between flex-wrap gap-4">
          <p className="font-black text-sm">
            Myplai<span className="text-[#7C3AFF]">&apos;z</span>
          </p>
          <div className="flex gap-6">
            <Link href="/rgpd" className="text-white/25 hover:text-white/60 text-xs transition-colors">
              Confidentialite
            </Link>
            <Link href="/apropos" className="text-white/25 hover:text-white/60 text-xs transition-colors">
              A propos
            </Link>
          </div>
          <p className="text-white/15 text-xs">Fait avec soin · 2025</p>
        </div>
      </footer>

    </main>
  )
}