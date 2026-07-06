export const words: string[] = [
  "javascript", "ordinateur", "clavier", "souris", "écran",
  "programmation", "algorithme", "variable", "fonction", "tableau",
  "objet", "classe", "module", "serveur", "client",
  "réseau", "internet", "navigateur", "interface", "base de données"
]

export function getRandomWord(): string {
  return words[Math.floor(Math.random() * words.length)]
}