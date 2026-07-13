// src/games/dames/ai.ts

import { Board, Move, RoomState, getValidMoves, applyMove } from "./board"

function evaluateBoard(board: Board): number {
    let score = 0
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            const piece = board[r][c]
            if (!piece) continue
            const value = piece.type === "queen" ? 3 : 1
            if (piece.color === "black") score += value
            else score -= value
        }
    }
    return score
}

function minimax(room: RoomState, depth: number, alpha: number, beta: number, maximizing: boolean): number {
    if (depth === 0 || room.status !== "playing") {
        return evaluateBoard(room.board)
    }

    const color = maximizing ? "black" : "white"
    const moves = getValidMoves(room.board, color, room.mustContinueFrom)

    if (moves.length === 0) return maximizing ? -Infinity : Infinity

    if (maximizing) {
        let best = -Infinity
        for (const move of moves) {
            const next = applyMove(room, move)
            const val = minimax(next, depth - 1, alpha, beta, next.currentTurn === "black")
            best = Math.max(best, val)
            alpha = Math.max(alpha, best)
            if (beta <= alpha) break
        }
        return best
    } else {
        let best = Infinity
        for (const move of moves) {
            const next = applyMove(room, move)
            const val = minimax(next, depth - 1, alpha, beta, next.currentTurn === "black")
            best = Math.min(best, val)
            beta = Math.min(beta, best)
            if (beta <= alpha) break
        }
        return best
    }
}

export function getBestMove(room: RoomState, depth: number = 4): Move | null {
    const moves = getValidMoves(room.board, "black", room.mustContinueFrom)
    if (moves.length === 0) return null

    let bestMove = moves[0]
    let bestVal = -Infinity

    for (const move of moves) {
        const next = applyMove(room, move)
        const val = minimax(next, depth - 1, -Infinity, Infinity, next.currentTurn === "black")
        if (val > bestVal) {
            bestVal = val
            bestMove = move
        }
    }

    return bestMove
}