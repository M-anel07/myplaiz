import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyPlai'z — Jeux en ligne",
  description: "Joue à des jeux en ligne gratuitement, solo ou multijoueur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#16132a]">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <footer className="shrink-0 border-t border-white/5 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white font-black tracking-tight text-sm">
            Myplai<span className="text-[#7C3AFF]">&apos;z</span>
          </p>
          <p className="text-white/30 text-xs tracking-wider">
            © {new Date().getFullYear()} MyPlai&apos;z — Tous droits réservés
          </p>
          <a
            href="/rgpd"
            className="text-white/30 hover:text-white/70 text-xs tracking-wider transition-colors underline underline-offset-4"
          >
            Politique de confidentialité
          </a>
        </footer>
      </body>
    </html>
  );
}