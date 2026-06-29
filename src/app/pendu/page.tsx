// src/app/pendu/page.tsx

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { socket } from "@/lib/socket"
import { RoomState } from "@/types/pendu"
import Board from "@/components/pendu/Board"

export default function PenduPage() {
  const router = useRouter()
  const [room, setRoom] = useState<RoomState | null>(null)
  const [playerName, setPlayerName] = useState("")
  const [roomId, setRoomId] = useState("")
  const [mode, setMode] = useState<"solo" | "multi">("solo")
  const [wordInput, setWordInput] = useState("")
  const [joined, setJoined] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [playerLeft, setPlayerLeft] = useState<string | null>(null)

  useEffect(() => {
    socket.connect()

    socket.on("room_update", (updatedRoom: RoomState) => {
      setRoom(prev => {
        if (prev && prev.players.length === 1 && updatedRoom.players.length === 2) {
          const newcomer = updatedRoom.players.find(p => p.id !== socket.id)
          if (newcomer) {
            setNotification(`${newcomer.name} a rejoint la salle !`)
            setTimeout(() => setNotification(null), 3000)
          }
        }

        if (prev && prev.players.length === 2 && updatedRoom.players.length === 1) {
          const quitter = prev.players.find(p => !updatedRoom.players.some(q => q.id === p.id))
          if (quitter) setPlayerLeft(quitter.name)
        }

        return updatedRoom
      })
    })

    return () => {
      socket.off("room_update")
      socket.disconnect()
    }
  }, [])

  function handleJoin() {
    if (!playerName.trim() || !roomId.trim()) return
    socket.emit("join_room", { roomId, mode, playerName })
    setJoined(true)
  }

  function handleSetWord() {
    if (!wordInput.trim()) return
    socket.emit("set_word", { roomId, word: wordInput.trim() })
    setWordInput("")
  }

  function handleGuess(letter: string) {
    socket.emit("guess_letter", { roomId, letter })
  }

  function handleRestart() {
    socket.emit("restart", { roomId })
  }

  function handleCopyRoomId() {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputClass = "w-full bg-[#1e1b2e] border-2 border-[#3d3660] text-white placeholder-white/30 px-6 py-5 rounded-2xl outline-none focus:border-[#7C3AFF] transition-colors text-base font-medium"
  const btnPrimary = "w-full bg-[#7C3AFF] hover:bg-[#6425e0] text-white py-5 rounded-2xl font-bold transition-all text-base tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98]"

  const isWordChooser =
    room !== null &&
    room.mode === "multi" &&
    room.status === "choosing" &&
    room.players[0]?.id === socket.id

  if (!joined) {
    return (
      <main className="min-h-screen bg-[#16132a] flex items-center justify-center px-4 relative">
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 text-white/40 hover:text-white text-xs font-medium tracking-wider uppercase transition-colors flex items-center gap-1.5"
        >
          <span>←</span> Jeux
        </button>

        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <p className="text-[#7C3AFF] text-xs tracking-[0.3em] uppercase mb-4 font-bold">Myplai&apos;z</p>
            <h1
              className="text-white text-7xl font-black tracking-tight leading-none"
              style={{ textShadow: "0 0 40px rgba(124,58,255,0.5), 0 0 80px rgba(124,58,255,0.2)" }}
            >
              PENDU
            </h1>
            <p className="text-white/30 text-sm mt-4 tracking-wider">Devine le mot avant de perdre</p>
          </div>

          <div className="flex gap-1 p-1 bg-[#1e1b2e] rounded-2xl mb-6 border-2 border-[#3d3660]">
            <button
              onClick={() => setMode("solo")}
              className={`flex-1 py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase transition-all ${
                mode === "solo" ? "bg-[#7C3AFF] text-white" : "text-white/30 hover:text-white/60"
              }`}
            >
              Ordi
            </button>
            <button
              onClick={() => setMode("multi")}
              className={`flex-1 py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase transition-all ${
                mode === "multi" ? "bg-[#7C3AFF] text-white" : "text-white/30 hover:text-white/60"
              }`}
            >
              Multijoueur
            </button>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <input
              type="text"
              placeholder="Votre nom"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              className={inputClass}
            />
            <div className="relative">
              <input
                type="text"
                placeholder="Code de la salle"
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleJoin()}
                className={inputClass}
              />
              {roomId && (
                <button
                  onClick={handleCopyRoomId}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-xs transition-colors"
                >
                  {copied ? "Copie !" : "⎘"}
                </button>
              )}
            </div>
          </div>

          <button onClick={handleJoin} className={btnPrimary}>
            Jouer
          </button>

          <p className="text-center text-white/20 text-xs mt-6 tracking-widest uppercase">
            Sans inscription
          </p>
        </div>
      </main>
    )
  }

  if (!room) {
    return (
      <main className="min-h-screen bg-[#16132a] flex items-center justify-center">
        <p className="text-white/30 text-xs tracking-[0.3em] uppercase">Connexion...</p>
      </main>
    )
  }

  if (isWordChooser) {
    return (
      <main className="min-h-screen bg-[#16132a] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <p className="text-[#00E5B4] text-xs tracking-[0.3em] uppercase mb-4 font-bold">Multijoueur</p>
            <h2
              className="text-white text-5xl font-black tracking-tight"
              style={{ textShadow: "0 0 40px rgba(0,229,180,0.4)" }}
            >
              Votre mot
            </h2>
            <p className="text-white/30 text-sm mt-4">Votre adversaire devra le deviner</p>
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Entrez un mot"
              value={wordInput}
              onChange={e => setWordInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSetWord()}
              className={inputClass}
            />
            <button onClick={handleSetWord} className={btnPrimary}>
              Valider
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#16132a] relative">

      {notification && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#1e1b2e] border border-[#7C3AFF]/40 text-white text-sm font-medium px-6 py-3 rounded-2xl shadow-lg"
          style={{ boxShadow: "0 0 20px rgba(124,58,255,0.3)" }}
        >
          {notification}
        </div>
      )}

      {playerLeft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div
            className="bg-[#1e1b2e] border border-white/10 rounded-3xl p-8 w-full max-w-xs text-center shadow-2xl"
            style={{ boxShadow: "0 0 60px rgba(124,58,255,0.2)" }}
          >
            <p className="text-white font-black text-xl mb-1">{playerLeft} a quitte</p>
            <p className="text-white/40 text-sm mb-8">La partie ne peut pas continuer.</p>
            <button
              onClick={() => {
                setPlayerLeft(null)
                setJoined(false)
                setRoom(null)
              }}
              className="w-full bg-[#7C3AFF] hover:bg-[#6425e0] text-white py-4 rounded-2xl font-bold tracking-widest uppercase text-sm transition-all"
              style={{ boxShadow: "0 0 24px rgba(124,58,255,0.4)" }}
            >
              Retour
            </button>
          </div>
        </div>
      )}

      <Board
        room={room}
        playerId={socket.id ?? ""}
        onGuess={handleGuess}
        onRestart={handleRestart}
      />
    </main>
  )
}