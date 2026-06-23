"use client"

import { tokeniseContent } from "@/lib/utils/content-parser"
import Link from "next/link"

interface RichTextContentProps {
  content: string
  className?: string
}

/**
 * Renders post content with #hashtag and @mention highlighting and links.
 */
export function RichTextContent({ content, className = "" }: RichTextContentProps) {
  if (!content) return null
  const tokens = tokeniseContent(content)

  return (
    <p className={`whitespace-pre-wrap break-words leading-relaxed ${className}`}>
      {tokens.map((token, i) => {
        if (token.type === "hashtag") {
          return (
            <Link
              key={i}
              href={`/explore?tag=${token.tag}`}
              className="text-brand-400 hover:text-brand-300 font-semibold transition-colors cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              {token.value}
            </Link>
          )
        }
        if (token.type === "mention") {
          return (
            <Link
              key={i}
              href={`/profile/${token.username}`}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              {token.value}
            </Link>
          )
        }
        return <span key={i}>{token.value}</span>
      })}
    </p>
  )
}
