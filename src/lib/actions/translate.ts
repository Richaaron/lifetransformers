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

