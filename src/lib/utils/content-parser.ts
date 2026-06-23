/**
 * Parses post content and extracts hashtags and mentions.
 * Returns an array of tokens: plain text, hashtag, or mention.
 */

export type ContentToken =
  | { type: "text";    value: string }
  | { type: "hashtag"; value: string; tag: string }
  | { type: "mention"; value: string; username: string }

const TOKEN_REGEX = /(#[a-zA-Z]\w{0,49}|@[a-zA-Z0-9_]{1,50})/g

/**
 * Tokenises a raw post content string into plain text, hashtag,
 * and mention segments for rendering with rich highlights.
 */
export function tokeniseContent(content: string): ContentToken[] {
  const tokens: ContentToken[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  TOKEN_REGEX.lastIndex = 0 // reset for global regex

  while ((match = TOKEN_REGEX.exec(content)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: content.slice(lastIndex, match.index) })
    }

    const raw = match[0]
    if (raw.startsWith("#")) {
      tokens.push({ type: "hashtag", value: raw, tag: raw.slice(1).toLowerCase() })
    } else {
      tokens.push({ type: "mention", value: raw, username: raw.slice(1).toLowerCase() })
    }

    lastIndex = match.index + raw.length
  }

  if (lastIndex < content.length) {
    tokens.push({ type: "text", value: content.slice(lastIndex) })
  }

  return tokens
}

/**
 * Extracts all unique hashtags from content string.
 */
export function extractHashtags(content: string): string[] {
  const matches = content.match(/#[a-zA-Z]\w{0,49}/g) || []
  return [...new Set(matches.map(m => m.slice(1).toLowerCase()))]
}

/**
 * Extracts all unique @mentions from content string.
 */
export function extractMentions(content: string): string[] {
  const matches = content.match(/@[a-zA-Z0-9_]{1,50}/g) || []
  return [...new Set(matches.map(m => m.slice(1).toLowerCase()))]
}
