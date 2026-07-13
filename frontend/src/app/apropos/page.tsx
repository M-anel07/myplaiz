// src/app/apropos/page.tsx

import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "A propos · MyPlai'z",
}

export default function AProposPage() {
    return (
        <main className="min-h-screen bg-[#0A0A14] text-white flex flex-col">
            <div className="px-6 pt-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-white/30 hover:text-white text-xs font-medium tracking-wider uppercase transition-colors w-fit"
                >
                    <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all text-base">‹</span>
                    Accueil
                </Link>
            </div>

            <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto px-6 py-16">
                <p className="text-[#00E5B4] text-xs tracking-[0.2em] uppercase font-medium mb-4">A propos</p>
                <h1 className="font-black text-4xl tracking-tight mb-8">
                    Myplai<span className="text-[#7C3AFF]">&apos;z</span>
                </h1>
                <div className="space-y-4 text-white/50 text-sm leading-relaxed">
                    <p>
                        Myplai&apos;z est une plateforme de jeux independante — chaque jeu est code et heberge ici, sans dependance a des services tiers.
                    </p>
                    <p>
                        Pas de publicite, pas d&apos;inscription obligatoire, pas de tracking. Juste des jeux.
                    </p>
                </div>
            </div>
        </main>
    )
}