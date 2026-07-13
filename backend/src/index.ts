// src/index.ts

import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import { createRoom, guessLetter, setWord, RoomState } from "./games/pendu/room"

const app = express()
app.use(cors())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: "*" }
})

const rooms = new Map<string, RoomState>()

io.on("connection", (socket) => {
  console.log(`Connecte : ${socket.id}`)

  socket.on("join_room", ({ roomId, mode, playerName }: {
    roomId: string
    mode: "solo" | "multi"
    playerName: string
  }) => {
    let room = rooms.get(roomId)
    if (!room) room = createRoom(roomId, mode)

    room.players.push({ id: socket.id, name: playerName })
    rooms.set(roomId, room)
    socket.join(roomId)

    if (mode === "multi" && room.players.length === 2) {
      room.status = "choosing"
      room.chooserId = room.players[0].id
      rooms.set(roomId, room)
    }

    io.to(roomId).emit("room_update", room)
    console.log(`${playerName} a rejoint ${roomId} (${mode})`)
  })

  socket.on("set_word", ({ roomId, word }: { roomId: string; word: string }) => {
    let room = rooms.get(roomId)
    if (!room || room.status !== "choosing") return
    if (room.mode === "multi" && socket.id !== room.chooserId) return

    room = setWord(room, word)
    rooms.set(roomId, room)
    io.to(roomId).emit("room_update", room)
  })

  socket.on("guess_letter", ({ roomId, letter }: { roomId: string; letter: string }) => {
    let room = rooms.get(roomId)
    if (!room) return

    room = guessLetter(room, letter)
    rooms.set(roomId, room)
    io.to(roomId).emit("room_update", room)
  })

  socket.on("restart", ({ roomId }: { roomId: string }) => {
    const room = rooms.get(roomId)
    if (!room) return

    const newRoom = createRoom(roomId, room.mode)

    // Inverser les roles en multi
    if (room.mode === "multi") {
      newRoom.players = [...room.players].reverse()
      newRoom.status = "choosing"
    } else {
      newRoom.players = room.players
    }

    rooms.set(roomId, newRoom)
    io.to(roomId).emit("room_update", newRoom)
  })

  socket.on("disconnect", () => {
    console.log(`Deconnecte : ${socket.id}`)
    rooms.forEach((room, roomId) => {
      room.players = room.players.filter(p => p.id !== socket.id)
      if (room.players.length === 0) {
        rooms.delete(roomId)
      } else {
        io.to(roomId).emit("room_update", room)
      }
    })
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Serveur lance sur http://localhost:${PORT}`)
})