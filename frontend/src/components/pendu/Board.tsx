// src/components/pendu/Board.tsx

"use client"

import { useRouter } from "next/navigation"
import { RoomState } from "@/types/pendu"
import WordDisplay from "./WordDisplay"
import Keyboard from "./Keyboard"

interface BoardProps {
  room: RoomState
  playerId: string
  onGuess: (letter: string) => void
  onRestart: () => void
}

function HangmanSVG({ wrong }: { wrong: number }) {
  const potence = { stroke: "#8b80c8", strokeWidth: 4, strokeLinecap: "round" as const }
  const corps = {
    stroke: "#a78bfa",
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    style: { filter: "drop-shadow(0 0 8px rgba(167,139,250,0.9))" }
  }

  return (
    <svg viewBox="0 0 200 220" className="w-full h-full">
      {wrong >= 1 && <line x1="20" y1="210" x2="180" y2="210" {...potence} />}
      {wrong >= 2 && <line x1="60" y1="210" x2="60" y2="20" {...potence} />}
      {wrong >= 3 && <line x1="60" y1="20" x2="130" y2="20" {...potence} />}
      {wrong >= 4 && <line x1="60" y1="60" x2="100" y2="20" {...potence} />}
      {wrong >= 5 && <line x1="130" y1="20" x2="130" y2="45" {...potence} />}
      {wrong >= 6 && <circle cx="130" cy="60" r="16" stroke="#a78bfa" strokeWidth="3" fill="none" style={{ filter: "drop-shadow(0 0 8px rgba(167,139,250,0.9))" }} />}
      {wrong >= 7 && <line x1="130" y1="76" x2="130" y2="135" {...corps} />}
      {wrong >= 8 && <line x1="130" y1="95" x2="105" y2="118" {...corps} />}
      {wrong >= 9 && <line x1="130" y1="95" x2="155" y2="118" {...corps} />}
      {wrong >= 10 && <line x1="130" y1="135" x2="108" y2="162" {...corps} />}
      {wrong >= 11 && <line x1="130" y1="135" x2="152" y2="162" {...corps} />}
    </svg>
  )
}

export default function Board({ room, playerId, onGuess, onRestart }: BoardProps) {
  const router = useRouter()
  const isGuesser = room.mode === "solo" || room.players.findIndex(p => p.id === playerId) === 1
  const wrong = room.wrongLetters.length
  const max = room.maxWrong

  function copyRoomId() {
    navigator.clipboard.writeText(room.roomId)
  }

  return (
    <div className="h-screen bg-[#16132a] flex flex-col overflow-hidden">

      <header className="shrink-0 border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="text-white/40 hover:text-white text-xs font-medium tracking-wider uppercase transition-colors flex items-center gap-1.5"
        >
          <span>←</span> Jeux
        </button>
        <p className="text-white font-black tracking-tight text-base">
          Myplai<span className="text-[#7C3AFF]">&apos;z</span>
        </p>
        <button
          onClick={copyRoomId}
          title="Copier le code de la salle"
          className="text-white/40 hover:text-white text-xs font-mono tracking-widest border border-white/10 hover:border-white/30 px-2.5 py-1 rounded-lg transition-all"
        >
          {room.roomId} ⎘
        </button>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row px-4 py-4 gap-4 max-w-3xl mx-auto w-full">

        <div className="shrink-0 flex flex-col items-center md:w-52">
          <div className="bg-[#1e1b2e] rounded-2xl border border-white/10 p-3 w-full">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-white/60 text-xs tracking-widest uppercase">Erreurs</span>
              <span className={`text-lg font-black tabular-nums ${
                wrong >= max ? "text-red-400" : wrong >= max - 2 ? "text-orange-400" : "text-white"
              }`}>
                {wrong}<span className="text-white/40 text-sm"> / {max}</span>
              </span>
            </div>
            <div className="w-full aspect-square max-h-36 md:max-h-48 mx-auto">
              <HangmanSVG wrong={wrong} />
            </div>
            <div className="flex gap-1.5 flex-wrap justify-center mt-2 min-h-[20px]">
              {room.wrongLetters.length === 0 && (
                <span className="text-white/40 text-xs tracking-widest uppercase">Aucune erreur</span>
              )}
              {room.wrongLetters.map(l => (
                <span key={l} className="text-red-400 font-bold uppercase text-xs tracking-widest"
                  style={{ textShadow: "0 0 6px rgba(255,68,68,0.5)" }}>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <p className="text-white/50 text-xs tracking-widest uppercase mt-3">
            {room.mode === "solo" ? "Contre l'ordi" : room.players.map(p => p.name).join(" vs ")}
          </p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-between min-h-0">
          <div className="w-full text-center">
            {room.status === "waiting" && room.mode === "multi" && (
              <p className="text-white/50 text-sm">En attente d&apos;un adversaire...</p>
            )}
            {room.status === "choosing" && !isGuesser && (
              <p className="text-white/50 text-sm">Votre adversaire choisit un mot...</p>
            )}
            {room.status === "won" && (
              <div>
                <p className="text-[#00E5B4] text-2xl font-black"
                  style={{ textShadow: "0 0 20px rgba(0,229,180,0.6)" }}>Gagne !</p>
                <p className="text-white/60 text-xs mt-1">Le mot : <span className="text-white font-bold">{room.word}</span></p>
              </div>
            )}
            {room.status === "lost" && (
              <div>
                <p className="text-red-400 text-2xl font-black"
                  style={{ textShadow: "0 0 20px rgba(255,68,68,0.6)" }}>Perdu</p>
                <p className="text-white/60 text-xs mt-1">Le mot : <span className="text-white font-bold">{room.word}</span></p>
              </div>
            )}
            {room.error && (
              <p className="text-orange-400 text-xs mt-1">{room.error}</p>
            )}
          </div>

          <WordDisplay
            word={room.word || ""}
            guessedLetters={room.guessedLetters}
            status={room.status}
          />

          <div className="w-full">
            {(room.status === "won" || room.status === "lost") ? (
              <button
                onClick={onRestart}
                className="w-full py-4 bg-[#7C3AFF] hover:bg-[#6425e0] text-white rounded-2xl font-bold tracking-widest uppercase text-sm transition-all"
                style={{ boxShadow: "0 0 24px rgba(124,58,255,0.4)" }}
              >
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
      </div>
    </div>
  )
}