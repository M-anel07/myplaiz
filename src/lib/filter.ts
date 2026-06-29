// src/lib/filter.ts

const BLOCKED_WORDS = [
  "pute", "salope", "connasse", "connard", "batard", "batarde",
  "enculé", "encule", "fdp", "ntm", "ta gueule", "nique",
  "niquer", "pd", "tapette", "pédé", "pede", "gouine",
  "négre", "negre", "nègre", "bamboula", "youpin", "youtre",
  "bougnoule", "bicot", "raton", "suicide", "viol", "violer",
  "tuer", "meurtre", "mort", "crève", "creve", "cancer",
  "sida", "handicapé", "handicape", "attardé", "attarde",
  "mongol", "débile", "debile", "idiot", "imbécile", "imbecile"
]

export function containsBlockedWord(input: string): boolean {
  const normalized = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")

  return BLOCKED_WORDS.some(word => {
    const normalizedWord = word
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
    return normalized.includes(normalizedWord)
  })
}