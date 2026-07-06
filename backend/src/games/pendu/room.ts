// src/games/pendu/room.ts

import { getRandomWord } from "./words"
import { containsBlockedWord } from "../../lib/filter"

export type GameMode = "solo" | "multi"
export type GameStatus = "waiting" | "choosing" | "playing" | "won" | "lost"

export interface Player {
  id: string
  name: string
}

export interface RoomState {
  roomId: string
  mode: GameMode
  status: GameStatus
  players: Player[]
  word: string
  guessedLetters: string[]
  wrongLetters: string[]
  maxWrong: number
  error?: string
}

export function createRoom(roomId: string, mode: GameMode): RoomState {
  return {
    roomId,
    mode,
    status: mode === "solo" ? "playing" : "waiting",
    players: [],
    word: mode === "solo" ? getRandomWord() : "",
    guessedLetters: [],
    wrongLetters: [],
    maxWrong: 10,
  }
}

export function setWord(room: RoomState, word: string): RoomState {
  if (containsBlockedWord(word)) {
    return { ...room, error: "Ce mot n'est pas autorise." }
  }
  return { ...room, word: word.toLowerCase(), status: "playing", error: undefined }
}

export function guessLetter(room: RoomState, letter: string): RoomState {
  if (room.status !== "playing") return room
  if (room.guessedLetters.includes(letter) || room.wrongLetters.includes(letter)) return room

  const normalized = letter.toLowerCase()
  const letterChars = room.word.toLowerCase().split("").filter(c => c !== " " && c !== "-")

  if (letterChars.includes(normalized)) {
    const guessedLetters = [...room.guessedLetters, normalized]
    const won = letterChars.every(l => guessedLetters.includes(l))
    return { ...room, guessedLetters, status: won ? "won" : "playing" }
  } else {
    const wrongLetters = [...room.wrongLetters, normalized]
    const lost = wrongLetters.length >= room.maxWrong
    return { ...room, wrongLetters, status: lost ? "lost" : "playing" }
  }
}