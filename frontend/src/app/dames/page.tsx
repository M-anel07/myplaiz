// src/app/dames/page.tsx

import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dames — Bientot disponible · MyPlai'z",
}

export default function DamesPage() {
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

            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <p className="text-white/20 text-xs tracking-[0.2em] uppercase mb-4">Myplai&apos;z</p>
                <h1 className="font-black text-5xl tracking-tight mb-4">Dames</h1>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-px w-12 bg-white/10" />
                    <p className="text-[#7C3AFF] text-xs tracking-[0.2em] uppercase font-medium">Bientot disponible</p>
                    <div className="h-px w-12 bg-white/10" />
                </div>
                <p className="text-white/30 text-sm max-w-xs leading-relaxed">
                    Ce jeu est en cours de developpement. Revenez bientot.
                </p>
            </div>
        </main>
    )
}