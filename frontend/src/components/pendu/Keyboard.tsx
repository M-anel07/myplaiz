const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("")

interface KeyboardProps {
  guessedLetters: string[]
  wrongLetters: string[]
  onGuess: (letter: string) => void
  disabled: boolean
}

export default function Keyboard({ guessedLetters, wrongLetters, onGuess, disabled }: KeyboardProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
      {LETTERS.map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isWrong = wrongLetters.includes(letter)
        return (
          <button
            key={letter}
            onClick={() => onGuess(letter)}
            disabled={disabled || isGuessed || isWrong}
            className={`w-10 h-10 rounded font-bold uppercase text-sm transition-colors
              ${isWrong ? "bg-red-900 text-red-300 cursor-not-allowed" : ""}
              ${isGuessed ? "bg-green-900 text-green-300 cursor-not-allowed" : ""}
              ${!isGuessed && !isWrong ? "bg-white/10 text-white hover:bg-white/20" : ""}
            `}
          >
            {letter}
          </button>
        )
      })}
    </div>
  )
}