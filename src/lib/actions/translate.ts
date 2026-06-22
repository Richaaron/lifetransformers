"use server"

const GOOGLE_TRANSLATE_API = "https://translation.googleapis.com/language/translate/v2"

export interface TranslationResult {
  translatedText: string
  detectedSourceLanguage?: string
}

export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<TranslationResult | { error: string }> {
  if (!text || !text.trim()) {
    return { error: "No text to translate" }
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY

  // If no API key, use free alternative
  if (!apiKey) {
    return await translateTextFree(text, targetLanguage, sourceLanguage)
  }

  try {
    const params = new URLSearchParams({
      q: text,
      target: targetLanguage,
      key: apiKey,
    })

    if (sourceLanguage) {
      params.append("source", sourceLanguage)
    }

    const response = await fetch(`${GOOGLE_TRANSLATE_API}?${params.toString()}`, {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`)
    }

    const data = await response.json()
    const translation = data.data.translations[0]

    return {
      translatedText: translation.translatedText,
      detectedSourceLanguage: translation.detectedSourceLanguage,
    }
  } catch (error) {
    console.error("Translation error:", error)
    return { error: "Translation failed" }
  }
}

// Free translation using MyMemory API (no API key required)
async function translateTextFree(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<TranslationResult | { error: string }> {
  try {
    const langPair = sourceLanguage 
      ? `${sourceLanguage}|${targetLanguage}` 
      : `en|${targetLanguage}`

    const params = new URLSearchParams({
      q: text,
      langpair: langPair,
    })

    const response = await fetch(
      `https://api.mymemory.translated.net/get?${params.toString()}`
    )

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.responseStatus === 200 && data.responseData) {
      return {
        translatedText: data.responseData.translatedText,
        detectedSourceLanguage: data.responseData.match?.source || sourceLanguage,
      }
    }

    throw new Error(data.responseDetails || "Translation failed")
  } catch (error) {
    console.error("Free translation error:", error)
    return { error: "Translation failed. Please try again." }
  }
}

export const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "yo", name: "Yoruba", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", flag: "🇳🇬" },
  { code: "ha", name: "Hausa", flag: "🇳🇬" },
  { code: "sw", name: "Swahili", flag: "🇰🇪" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
  { code: "tl", name: "Filipino", flag: "🇵🇭" },
  { code: "he", name: "Hebrew", flag: "🇮🇱" },
]
