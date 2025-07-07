import { GoogleGenAI } from "@google/genai";
import "dotenv/config.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getSpeakingFeedback(transcriptText, topic) {
  try {
    const prompt = `
You are a professional TOEIC Speaking evaluator.
Topic: ${topic}

Student's script:
"${transcriptText}"

Based on this script (converted from speech), please provide feedback in the following format:
1. Grammar & Vocabulary: [Your comments]
2. Content Logic: [Your comments]
3. Fluency & Pronunciation: [Your comments]
(Estimate fluency and pronunciation issues based on pauses, repetition, or unnatural phrasing that might be reflected in the transcript)

Use concise, professional language suitable for TOEIC preparation.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const rawText = response.text;

    if (!rawText || rawText.trim() === "") {
      throw new Error("No text response from Gemini.");
    }

    // Phân tích kết quả text thành các phần
    const grammarMatch = rawText.match(/1\.\s*(Grammar & Vocabulary:)?\s*([\s\S]*?)(?=2\.)/i);
    const contentMatch = rawText.match(/2\.\s*(Content Logic:)?\s*([\s\S]*?)(?=3\.)/i);
    const fluencyMatch = rawText.match(/3\.\s*(Fluency & Pronunciation:)?\s*([\s\S]*)/i);

    const feedback = {
      grammar: grammarMatch ? grammarMatch[2].trim() : "No grammar feedback.",
      contentLogic: contentMatch ? contentMatch[2].trim() : "No content logic feedback.",
      fluency: fluencyMatch ? fluencyMatch[2].trim() : "No fluency feedback.",
    };

    return feedback;
  } catch (error) {
    console.error("Gemini feedback error:", error);
    return {
      grammar: "Could not get feedback at this time.",
      contentLogic: "Could not get feedback at this time.",
      fluency: "Could not get feedback at this time.",
    };
  }
}