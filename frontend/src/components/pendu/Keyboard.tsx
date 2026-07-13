// src/components/pendu/Keyboard.tsx

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("")

interface KeyboardProps {
  guessedLetters: string[]
  wrongLetters: string[]
  onGuess: (letter: string) => void
  disabled: boolean
}

export default function Keyboard({ guessedLetters, wrongLetters, onGuess, disabled }: KeyboardProps) {
  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {LETTERS.map(letter => {
        const isWrong = wrongLetters.includes(letter)
        const isGuessed = guessedLetters.includes(letter)
        const isUsed = isWrong || isGuessed

        return (
          <button
            key={letter}
            onClick={() => onGuess(letter)}
            disabled={disabled || isUsed}
            className={`
              w-10 h-10 rounded-lg font-bold uppercase text-sm transition-all
              ${isWrong ? "bg-red-900/40 text-red-400/50 cursor-not-allowed" : ""}
              ${isGuessed ? "bg-[#7C3AFF]/20 text-[#7C3AFF]/50 cursor-not-allowed" : ""}
              ${!isUsed && !disabled ? "bg-white/8 text-white hover:bg-white/15 active:scale-95 border border-white/10" : ""}
              ${!isUsed && disabled ? "bg-white/5 text-white/20 cursor-not-allowed" : ""}
            `}
            style={!isUsed && !disabled ? {} : {}}
          >
            {letter}
          </button>
        )
      })}
    </div>
  )
}