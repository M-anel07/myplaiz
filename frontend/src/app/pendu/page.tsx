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
  const [playerLeft, setPlayerLeft] = useState<string | null>(null)
  const [leaving, setLeaving] = useState(false)

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
    return () => { socket.off("room_update"); socket.disconnect() }
  }, [])

  function handleJoin() {
    if (!playerName.trim()) return
    if (mode === "multi" && !roomId.trim()) return
    const finalRoomId = mode === "solo" ? Math.random().toString(36).substring(2, 8) : roomId
    setRoomId(finalRoomId)
    socket.emit("join_room", { roomId: finalRoomId, mode, playerName })
    setJoined(true)
  }

  function handleSetWord() {
    if (!wordInput.trim()) return
    socket.emit("set_word", { roomId, word: wordInput.trim() })
    setWordInput("")
  }

  function handleGuess(letter: string) { socket.emit("guess_letter", { roomId, letter }) }
  function handleRestart() { socket.emit("restart", { roomId }) }

  function handleLeave() {
    setLeaving(true)
    setTimeout(() => router.push("/"), 350)
  }

  const input = "w-full bg-[#1a1730] border border-[#2e2a50] text-white placeholder-white/20 px-5 py-4 rounded-xl outline-none focus:border-[#7C3AFF]/70 transition-colors text-base"
  const btnMain = "w-full bg-[#7C3AFF] hover:bg-[#6d2ff0] active:scale-[0.98] text-white py-4 rounded-xl font-bold transition-all text-sm tracking-widest uppercase"

  const isWordChooser =
    room !== null &&
    room.mode === "multi" &&
    room.status === "choosing" &&
    room.chooserId === socket.id

  if (!joined) {
    return (
      <main
        className="min-h-screen bg-[#0f0d1e] flex flex-col px-5 transition-opacity duration-300"
        style={{ opacity: leaving ? 0 : 1 }}
      >
        <div className="pt-6 pb-2">
          <button
            onClick={handleLeave}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
          >
            <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-white/10 transition-all text-base">‹</span>
            <span className="text-xs font-medium tracking-wider uppercase">Accueil</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-8">
          <div className="mb-10">
            <p className="text-[#7C3AFF] text-xs tracking-[0.25em] uppercase font-bold mb-3">Myplai&apos;z</p>
            <h1
              className="text-white font-black leading-none tracking-tight"
              style={{ fontSize: "clamp(3.5rem, 15vw, 5rem)", textShadow: "0 0 50px rgba(124,58,255,0.4)" }}
            >
              PENDU
            </h1>
            <p className="text-white/30 text-sm mt-3">Devine le mot avant de perdre</p>
          </div>

          <div className="flex p-1 bg-[#1a1730] rounded-xl mb-5 border border-[#2e2a50]">
            {(["solo", "multi"] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${
                  mode === m ? "bg-[#7C3AFF] text-white" : "text-white/30 hover:text-white/60"
                }`}
              >
                {m === "solo" ? "Contre l'ordi" : "Multijoueur"}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 mb-5">
            <input type="text" placeholder="Votre nom" value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleJoin()}
              className={input} />
            {mode === "multi" && (
              <input type="text" placeholder="Code de la salle" value={roomId}
                onChange={e => setRoomId(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleJoin()}
                className={input} />
            )}
          </div>

          <button onClick={handleJoin} className={btnMain}>Jouer</button>
        </div>
      </main>
    )
  }

  if (!room) {
    return (
      <main className="min-h-screen bg-[#0f0d1e] flex items-center justify-center">
        <p className="text-white/20 text-xs tracking-[0.3em] uppercase">Connexion...</p>
      </main>
    )
  }

  if (isWordChooser) {
    return (
      <main className="min-h-screen bg-[#0f0d1e] flex flex-col px-5">
        <div className="pt-6 pb-2">
          <button
            onClick={() => { setJoined(false); setRoom(null) }}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
          >
            <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-white/10 transition-all text-base">‹</span>
            <span className="text-xs font-medium tracking-wider uppercase">Retour</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div className="mb-10">
            <p className="text-[#00E5B4] text-xs tracking-[0.25em] uppercase font-bold mb-3">Multijoueur</p>
            <h2 className="text-white font-black text-4xl tracking-tight"
              style={{ textShadow: "0 0 40px rgba(0,229,180,0.3)" }}>
              Choisissez un mot
            </h2>
            <p className="text-white/30 text-sm mt-2">Votre adversaire devra le deviner</p>
          </div>
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Entrez un mot" value={wordInput}
              onChange={e => setWordInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSetWord()} className={input} />
            <button onClick={handleSetWord} className={btnMain}>Valider</button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main
      className="min-h-screen bg-[#0f0d1e] relative transition-opacity duration-300"
      style={{ opacity: leaving ? 0 : 1 }}
    >
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1a1730] border border-[#7C3AFF]/30 text-white text-sm px-5 py-2.5 rounded-xl"
          style={{ boxShadow: "0 0 20px rgba(124,58,255,0.25)" }}>
          {notification}
        </div>
      )}
      {playerLeft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-5">
          <div className="bg-[#1a1730] border border-white/10 rounded-2xl p-7 w-full max-w-xs text-center">
            <p className="text-white font-black text-xl mb-1">{playerLeft} a quitte</p>
            <p className="text-white/40 text-sm mb-7">La partie ne peut pas continuer.</p>
            <button onClick={() => { setPlayerLeft(null); setJoined(false); setRoom(null) }}
              className={btnMain}>Retour</button>
          </div>
        </div>
      )}
      <Board room={room} playerId={socket.id ?? ""} onGuess={handleGuess} onRestart={handleRestart} onLeave={handleLeave} />
    </main>
  )
}