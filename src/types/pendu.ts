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
}