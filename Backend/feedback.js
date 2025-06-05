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

      Please provide feedback in the following format:
      1. Grammar & Vocabulary: [Your comments]
      2. Content Logic: [Your comments]
      Use concise, professional language suitable for TOEIC preparation.
      `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response.text;

    if (!text || text.trim() === "") {
      throw new Error("No text response from Gemini.");
    }

    return text;
  } catch (error) {
    console.error("Gemini feedback error:", error);
    return "Could not get feedback at this time.";
  }
}