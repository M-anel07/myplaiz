// src/components/pendu/WordDisplay.tsx

interface WordDisplayProps {
  word: string
  guessedLetters: string[]
  status: string
}

export default function WordDisplay({ word, guessedLetters, status }: WordDisplayProps) {
  const gameOver = status === "won" || status === "lost"

  return (
    <div className="flex gap-1 justify-center flex-wrap my-6 px-2">
      {word.split("").map((char, i) => {
        const isSpace = char === " "
        const isHyphen = char === "-"
        const isSpecial = isSpace || isHyphen
        const revealed = isSpecial || guessedLetters.includes(char.toLowerCase()) || gameOver

        if (isSpace) {
          return <div key={i} className="w-5" />
        }

        if (isHyphen) {
          return (
            <div key={i} className="flex flex-col items-center justify-end pb-1">
              <span className="text-white/60 font-black text-xl leading-none">-</span>
              <div className="w-6 h-0.5 bg-transparent mt-1" />
            </div>
          )
        }

        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <span
              className="text-2xl font-black w-7 text-center leading-none"
              style={{
                color: revealed ? "#fff" : "transparent",
                textShadow: revealed && !gameOver ? "0 0 16px rgba(124,58,255,0.5)" : "none"
              }}
            >
              {char.toUpperCase()}
            </span>
            <div className={`w-7 h-0.5 ${revealed && !gameOver ? "bg-[#7C3AFF]" : "bg-white/20"}`} />
          </div>
        )
      })}
    </div>
  )
}