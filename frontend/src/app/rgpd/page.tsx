// src/app/rgpd/page.tsx

import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Politique de confidentialité — MyPlai'z",
    description: "Politique de confidentialité de MyPlai'z.",
}

export default function RGPDPage() {
    return (
        <main className="min-h-screen bg-[#16132a] px-6 py-16 flex flex-col items-center">
            <div className="w-full max-w-2xl">

                {/* Header */}
                <Link
                    href="/"
                    className="text-white/40 hover:text-white text-xs font-medium tracking-wider uppercase transition-colors flex items-center gap-1.5 mb-12"
                >
                    <span>←</span> Retour
                </Link>

                <p className="text-[#7C3AFF] text-xs tracking-[0.3em] uppercase mb-3 font-bold">MyPlai&apos;z</p>
                <h1 className="text-white text-4xl font-black tracking-tight mb-2">
                    Politique de confidentialité
                </h1>
                <p className="text-white/40 text-sm mb-12">
                    Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>

                <div className="flex flex-col gap-10 text-white/70 text-sm leading-7">

                    <section>
                        <h2 className="text-white font-bold text-base mb-3 tracking-wide uppercase text-xs text-[#7C3AFF]">
                            1. Qui sommes-nous ?
                        </h2>
                        <p>
                            MyPlai&apos;z est une plateforme de jeux en ligne développée et hébergée à titre personnel.
                            Ce site n&apos;est pas édité par une société commerciale.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-white font-bold text-base mb-3 tracking-wide uppercase text-xs text-[#7C3AFF]">
                            2. Données collectées
                        </h2>
                        <p>
                            MyPlai&apos;z ne collecte <strong className="text-white">aucune donnée personnelle</strong>. Il n&apos;y a pas de compte utilisateur,
                            pas d&apos;inscription, pas d&apos;adresse e-mail, pas de mot de passe.
                        </p>
                        <p className="mt-3">
                            Les pseudonymes saisis lors d&apos;une partie sont utilisés uniquement le temps de la session de jeu.
                            Ils ne sont ni enregistrés en base de données, ni transmis à des tiers, ni conservés après la fin de la partie.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-white font-bold text-base mb-3 tracking-wide uppercase text-xs text-[#7C3AFF]">
                            3. Cookies
                        </h2>
                        <p>
                            MyPlai&apos;z n&apos;utilise <strong className="text-white">aucun cookie </strong> de traçage, de publicité ou d&apos;analyse.
                            Aucun outil de statistiques tiers (Google Analytics, etc.) n&apos;est intégré.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-white font-bold text-base mb-3 tracking-wide uppercase text-xs text-[#7C3AFF]">
                            4. Données de connexion
                        </h2>
                        <p>
                            Comme tout serveur web, notre infrastructure peut conserver des journaux techniques (logs)
                            incluant les adresses IP des visiteurs. Ces données sont conservées pour une durée maximale
                            de <strong className="text-white">7 jours </strong> à des fins de sécurité et de débogage, puis supprimées automatiquement.
                            Elles ne sont pas exploitées à d&apos;autres fins.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-white font-bold text-base mb-3 tracking-wide uppercase text-xs text-[#7C3AFF]">
                            5. Partage avec des tiers
                        </h2>
                        <p>
                            Aucune donnée n&apos;est vendue, partagée ou transmise à des tiers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-white font-bold text-base mb-3 tracking-wide uppercase text-xs text-[#7C3AFF]">
                            6. Vos droits (RGPD)
                        </h2>
                        <p>
                            Conformément au Règlement Général sur la Protection des Données (RGPD),
                            vous disposez de droits sur vos données personnelles : accès, rectification, suppression, portabilité.
                        </p>
                        <p className="mt-3">
                            Dans la mesure où MyPlai&apos;z ne conserve aucune donnée personnelle identifiable,
                            ces droits s&apos;exercent de facto sans démarche particulière.
                            Pour toute question, vous pouvez nous contacter à l&apos;adresse suivante :
                        </p>
                        <p className="mt-3">
                            <a
                                href="mailto:contact@myplaiz.fr"
                                className="text-[#7C3AFF] hover:text-[#a78bfa] underline underline-offset-4 transition-colors"
                            >
                                thestraw7@gmail.com
                            </a>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-white font-bold text-base mb-3 tracking-wide uppercase text-xs text-[#7C3AFF]">
                            7. Modifications
                        </h2>
                        <p>
                            Cette politique peut être mise à jour à tout moment. La date de dernière mise à jour
                            est indiquée en haut de cette page.
                        </p>
                    </section>

                </div>

                {/* Retour bas de page */}
                <div className="mt-16 pt-8 border-t border-white/5">
                    <Link
                        href="/"
                        className="text-white/40 hover:text-white text-xs font-medium tracking-wider uppercase transition-colors flex items-center gap-1.5"
                    >
                        <span>←</span> Retour à l&apos;accueil
                    </Link>
                </div>

            </div>
        </main>
    )
}