/**
 * Message Encryption Utilities — Server-Only (AES-256-GCM)
 *
 * Each conversation gets a unique derived key:
 *   key = scrypt(ENCRYPTION_SECRET, conversationId, 32 bytes)
 *
 * Ciphertext format stored in DB:
 *   "enc:" + base64( IV(12) + ciphertext + authTag(16) )
 *
 * This prefix lets us safely handle legacy unencrypted messages.
 */

import crypto from "crypto"

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET

if (!ENCRYPTION_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("ENCRYPTION_SECRET environment variable is not set")
}

/** Derive a 256-bit key unique to this conversation */
function deriveKey(conversationId: string): Buffer {
  const secret = ENCRYPTION_SECRET || "dev-fallback-secret-change-in-production"
  return crypto.scryptSync(secret, conversationId, 32)
}

/** Encrypt a plaintext string. Returns "enc:<base64>" */
export function encryptMessage(plaintext: string, conversationId: string): string {
  if (!plaintext) return plaintext
  const key = deriveKey(conversationId)
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()])
  const authTag = cipher.getAuthTag()
  const payload = Buffer.concat([iv, encrypted, authTag])
  return "enc:" + payload.toString("base64")
}

/** Decrypt a "enc:<base64>" string. Returns original plaintext. */
export function decryptMessage(ciphertext: string, conversationId: string): string {
  if (!ciphertext || !ciphertext.startsWith("enc:")) return ciphertext
  try {
    const key = deriveKey(conversationId)
    const payload = Buffer.from(ciphertext.slice(4), "base64")
    const iv = payload.subarray(0, 12)
    const authTag = payload.subarray(payload.length - 16)
    const encrypted = payload.subarray(12, payload.length - 16)
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
    decipher.setAuthTag(authTag)
    return decipher.update(encrypted) + decipher.final("utf8")
  } catch {
    // If decryption fails, return a placeholder rather than crashing
    return "[encrypted message]"
  }
}

/** Decrypt the content field on an array of message objects */
export function decryptMessages(messages: any[], conversationId: string): any[] {
  return messages.map((msg) => ({
    ...msg,
    content: decryptMessage(msg.content ?? "", conversationId),
  }))
}
