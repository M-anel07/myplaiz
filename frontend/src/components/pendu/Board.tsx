// src/components/pendu/Board.tsx

"use client"

import { RoomState } from "@/types/pendu"
import WordDisplay from "./WordDisplay"
import Keyboard from "./Keyboard"

interface BoardProps {
  room: RoomState
  playerId: string
  onGuess: (letter: string) => void
  onRestart: () => void
  onLeave: () => void
}

function HangmanSVG({ wrong, status }: { wrong: number; status: string }) {
  const count = status === "lost" ? 11 : wrong
  const p = { stroke: "#6d64a8", strokeWidth: 3, strokeLinecap: "round" as const }
  const c = { stroke: "#a78bfa", strokeWidth: 2.5, strokeLinecap: "round" as const, style: { filter: "drop-shadow(0 0 6px rgba(167,139,250,0.8))" } }

  return (
    <svg viewBox="0 0 160 180" className="w-full h-full">
      {count >= 1 && <line x1="10" y1="170" x2="150" y2="170" {...p} />}
      {count >= 2 && <line x1="45" y1="170" x2="45" y2="15" {...p} />}
      {count >= 3 && <line x1="45" y1="15" x2="105" y2="15" {...p} />}
      {count >= 4 && <line x1="45" y1="45" x2="75" y2="15" {...p} />}
      {count >= 5 && <line x1="105" y1="15" x2="105" y2="35" {...p} />}
      {count >= 6 && <circle cx="105" cy="48" r="13" stroke="#a78bfa" strokeWidth="2.5" fill="none" style={{ filter: "drop-shadow(0 0 6px rgba(167,139,250,0.8))" }} />}
      {count >= 7 && <line x1="105" y1="61" x2="105" y2="108" {...c} />}
      {count >= 8 && <line x1="105" y1="75" x2="85" y2="93" {...c} />}
      {count >= 9 && <line x1="105" y1="75" x2="125" y2="93" {...c} />}
      {count >= 10 && <line x1="105" y1="108" x2="88" y2="130" {...c} />}
      {count >= 11 && <line x1="105" y1="108" x2="122" y2="130" {...c} />}
    </svg>
  )
}

export default function Board({ room, playerId, onGuess, onRestart, onLeave }: BoardProps) {
  const isGuesser = room.mode === "solo" || room.players.findIndex(p => p.id === playerId) === 1
  const wrong = room.wrongLetters.length
  const max = room.maxWrong

  return (
    <div className="h-[100dvh] bg-[#0f0d1e] flex flex-col max-w-2xl mx-auto w-full">

      {/* Header */}
      <header className="shrink-0 flex items-center gap-3 px-4 pt-4 pb-3">
        <button
          onClick={onLeave}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group shrink-0"
        >
          <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-white/10 transition-all text-base">‹</span>
          <span className="text-xs font-medium tracking-wider uppercase">Accueil</span>
        </button>

        <div className="h-4 w-px bg-white/10" />

        {room.mode === "multi" ? (
          <span className="text-white/25 text-xs font-mono tracking-widest">{room.roomId}</span>
        ) : (
          <span className="text-white/20 text-xs tracking-widest uppercase">Solo</span>
        )}

        <div className="flex-1" />

        <span className={`text-sm font-black tabular-nums ${
          wrong >= max ? "text-red-400" : wrong >= max - 2 ? "text-orange-400" : "text-white/50"
        }`}>
          {wrong}<span className="text-white/20 text-xs font-normal"> / {max}</span>
        </span>
      </header>

      {/* Pendu + infos */}
      <div className="shrink-0 flex items-center gap-4 px-4 py-2">
        <div className="bg-[#1a1730] rounded-2xl border border-white/5 p-2 w-28 h-28 shrink-0 md:w-36 md:h-36">
          <HangmanSVG wrong={wrong} status={room.status} />
        </div>

        <div className="flex-1 min-w-0">
          {room.status === "playing" && (
            <>
              <p className="text-white/20 text-xs uppercase tracking-widest mb-2">Lettres ratees</p>
              <div className="flex gap-1.5 flex-wrap min-h-[20px]">
                {room.wrongLetters.length === 0
                  ? <span className="text-white/15 text-xs">Aucune</span>
                  : room.wrongLetters.map(l => (
                    <span key={l} className="text-red-400 font-bold uppercase text-xs"
                      style={{ textShadow: "0 0 6px rgba(255,68,68,0.5)" }}>{l}</span>
                  ))
                }
              </div>
              {room.mode === "multi" && room.players.length === 2 && (
                <p className="text-white/20 text-xs mt-2 tracking-wide">{room.players.map(p => p.name).join(" vs ")}</p>
              )}
            </>
          )}
          {room.status === "waiting" && (
            <p className="text-white/40 text-sm">En attente d&apos;un adversaire...</p>
          )}
          {room.status === "choosing" && !isGuesser && (
            <p className="text-white/40 text-sm">L&apos;adversaire choisit un mot...</p>
          )}
          {room.status === "won" && (
            <div>
              <p className="text-[#00E5B4] text-2xl font-black"
                style={{ textShadow: "0 0 20px rgba(0,229,180,0.5)" }}>Gagne !</p>
              <p className="text-white/30 text-xs mt-1">Mot : <span className="text-white font-bold">{room.word}</span></p>
            </div>
          )}
          {room.status === "lost" && (
            <div>
              <p className="text-red-400 text-2xl font-black"
                style={{ textShadow: "0 0 20px rgba(255,68,68,0.5)" }}>Perdu</p>
              <p className="text-white/30 text-xs mt-1">Mot : <span className="text-white font-bold">{room.word}</span></p>
            </div>
          )}
          {room.error && <p className="text-orange-400 text-xs mt-1">{room.error}</p>}
        </div>
      </div>

      {/* Mot */}
      <div className="flex-1 flex items-center justify-center px-4 min-h-0">
        <WordDisplay
          word={room.word || ""}
          guessedLetters={room.guessedLetters}
          status={room.status}
        />
      </div>

      {/* Clavier */}
      <div className="shrink-0 px-3 pb-4 md:pb-6">
        {(room.status === "won" || room.status === "lost") ? (
          <button onClick={onRestart}
            className="w-full py-4 bg-[#7C3AFF] hover:bg-[#6d2ff0] text-white rounded-xl font-bold tracking-widest uppercase text-sm transition-all max-w-sm mx-auto block"
            style={{ boxShadow: "0 0 20px rgba(124,58,255,0.35)" }}>
            Rejouer
          </button>
        ) : (
          <Keyboard
            guessedLetters={room.guessedLetters}
            wrongLetters={room.wrongLetters}
            onGuess={onGuess}
            disabled={!isGuesser || room.status !== "playing"}
          />
        )}
      </div>
    </div>
  )
}