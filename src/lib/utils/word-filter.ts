const CURSE_WORDS = [
  "fuck", "fucking", "fucked", "fucker", "fucks",
  "shit", "shitting", "shitty", "bullshit",
  "damn", "dammit", "goddamn",
  "bitch", "bitches", "bitching",
  "ass", "asshole", "asses",
  "bastard", "bastards",
  "crap", "crappy",
  "dick", "dickhead",
  "piss", "pissed",
  "cock", "cocks",
  "pussy", " pussies",
  "nigger", "niggers", "nigga", "niggas",
  "retard", "retarded", "retards",
  "slut", "sluts", "whore", "whores",
  "hoe", "hoes",
  "wtf", "stfu", "af",
  "lmao", "lmfao",
]

const VARIATIONS: Record<string, string> = {
  "a": "@",
  "e": "3",
  "i": "1",
  "o": "0",
  "s": "$",
  "t": "7",
}

function normalize(text: string): string {
  let normalized = text.toLowerCase()
  
  for (const [char, replacement] of Object.entries(VARIATIONS)) {
    normalized = normalized.replaceAll(replacement, char)
  }
  
  normalized = normalized.replace(/[^a-z]/g, "")
  
  return normalized
}

export function containsCurseWords(text: string): { hasCurse: boolean; filtered: string } {
  const words = text.split(/(\s+)/)
  let hasCurse = false
  const filteredWords: string[] = []

  for (const word of words) {
    const cleaned = normalize(word)
    const isCurse = CURSE_WORDS.some(curse => cleaned === curse || cleaned.includes(curse))
    
    if (isCurse) {
      hasCurse = true
      filteredWords.push("*".repeat(word.length))
    } else {
      filteredWords.push(word)
    }
  }

  return { hasCurse, filtered: filteredWords.join("") }
}

export function filterText(text: string): string {
  return containsCurseWords(text).filtered
}
