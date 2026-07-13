// src/games/dames/board.ts

export type Color = "white" | "black"
export type PieceType = "pawn" | "queen"

export interface Piece {
    color: Color
    type: PieceType
}

export type Cell = Piece | null

export type Board = Cell[][]

export type GameStatus = "waiting" | "playing" | "won" | "draw"

export interface Position {
    row: number
    col: number
}

export interface Move {
    from: Position
    to: Position
    captures: Position[]
}

export interface Player {
    id: string
    name: string
    color: Color
}

export interface RoomState {
    roomId: string
    board: Board
    players: Player[]
    currentTurn: Color
    status: GameStatus
    winner?: Color
    mustContinueFrom?: Position
}

export function createInitialBoard(): Board {
    const board: Board = Array(10).fill(null).map(() => Array(10).fill(null))

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 10; col++) {
            if ((row + col) % 2 === 1) {
                board[row][col] = { color: "black", type: "pawn" }
            }
        }
    }

    for (let row = 6; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            if ((row + col) % 2 === 1) {
                board[row][col] = { color: "white", type: "pawn" }
            }
        }
    }

    return board
}

export function createRoom(roomId: string): RoomState {
    return {
        roomId,
        board: createInitialBoard(),
        players: [],
        currentTurn: "white",
        status: "waiting",
    }
}

function inBounds(row: number, col: number): boolean {
    return row >= 0 && row < 10 && col >= 0 && col < 10
}

function getCaptureMoves(board: Board, pos: Position, color: Color, type: PieceType): Move[] {
    const moves: Move[] = []
    const enemy = color === "white" ? "black" : "white"
    const dirs = type === "queen"
        ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
        : color === "white"
            ? [[-1, -1], [-1, 1]]
            : [[1, -1], [1, 1]]

    for (const [dr, dc] of dirs) {
        if (type === "queen") {
            let r = pos.row + dr
            let c = pos.col + dc
            let captured: Position | null = null

            while (inBounds(r, c)) {
                const cell = board[r][c]
                if (cell) {
                    if (cell.color === enemy && !captured) {
                        captured = { row: r, col: c }
                    } else {
                        break
                    }
                } else if (captured) {
                    moves.push({ from: pos, to: { row: r, col: c }, captures: [captured] })
                }
                r += dr
                c += dc
            }
        } else {
            const mr = pos.row + dr
            const mc = pos.col + dc
            const lr = pos.row + dr * 2
            const lc = pos.col + dc * 2
            if (inBounds(mr, mc) && inBounds(lr, lc)) {
                const mid = board[mr][mc]
                const land = board[lr][lc]
                if (mid && mid.color === enemy && !land) {
                    moves.push({ from: pos, to: { row: lr, col: lc }, captures: [{ row: mr, col: mc }] })
                }
            }
        }
    }

    return moves
}

function getSimpleMoves(board: Board, pos: Position, color: Color, type: PieceType): Move[] {
    const moves: Move[] = []
    const dirs = type === "queen"
        ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
        : color === "white"
            ? [[-1, -1], [-1, 1]]
            : [[1, -1], [1, 1]]

    for (const [dr, dc] of dirs) {
        if (type === "queen") {
            let r = pos.row + dr
            let c = pos.col + dc
            while (inBounds(r, c) && !board[r][c]) {
                moves.push({ from: pos, to: { row: r, col: c }, captures: [] })
                r += dr
                c += dc
            }
        } else {
            const nr = pos.row + dr
            const nc = pos.col + dc
            if (inBounds(nr, nc) && !board[nr][nc]) {
                moves.push({ from: pos, to: { row: nr, col: nc }, captures: [] })
            }
        }
    }

    return moves
}

export function getValidMoves(board: Board, color: Color, mustContinueFrom?: Position): Move[] {
    const positions: Position[] = []

    if (mustContinueFrom) {
        positions.push(mustContinueFrom)
    } else {
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                if (board[r][c]?.color === color) {
                    positions.push({ row: r, col: c })
                }
            }
        }
    }

    const captures: Move[] = []
    for (const pos of positions) {
        const piece = board[pos.row][pos.col]!
        captures.push(...getCaptureMoves(board, pos, piece.color, piece.type))
    }

    if (captures.length > 0) return captures

    if (mustContinueFrom) return []

    const simple: Move[] = []
    for (const pos of positions) {
        const piece = board[pos.row][pos.col]!
        simple.push(...getSimpleMoves(board, pos, piece.color, piece.type))
    }

    return simple
}

export function applyMove(room: RoomState, move: Move): RoomState {
    const board = room.board.map(r => [...r])
    const piece = board[move.from.row][move.from.col]!

    board[move.from.row][move.from.col] = null

    for (const cap of move.captures) {
        board[cap.row][cap.col] = null
    }

    let finalPiece: Piece = piece
    if (piece.type === "pawn") {
        if ((piece.color === "white" && move.to.row === 0) ||
            (piece.color === "black" && move.to.row === 9)) {
            finalPiece = { ...piece, type: "queen" }
        }
    }

    board[move.to.row][move.to.col] = finalPiece

    // Verifier si on peut continuer a capturer
    let mustContinueFrom: Position | undefined
    if (move.captures.length > 0 && finalPiece.type === piece.type) {
        const continueMoves = getCaptureMoves(board, move.to, finalPiece.color, finalPiece.type)
        if (continueMoves.length > 0) {
            mustContinueFrom = move.to
        }
    }

    const nextTurn = mustContinueFrom ? room.currentTurn : (room.currentTurn === "white" ? "black" : "white")

    // Verifier victoire
    const enemy = nextTurn
    const enemyMoves = getValidMoves(board, enemy, undefined)
    let status: GameStatus = "playing"
    let winner: Color | undefined

    if (enemyMoves.length === 0) {
        status = "won"
        winner = room.currentTurn
    }

    return {
        ...room,
        board,
        currentTurn: nextTurn,
        status,
        winner,
        mustContinueFrom,
    }
}