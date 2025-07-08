import { GoogleGenAI } from "@google/genai";
import "dotenv/config.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getSpeakingFeedback(transcriptText, topic) {
  try {
    const prompt = `
You are a professional TOEIC/IELTS Speaking evaluator.

Topic: ${topic}

Student's script:
"${transcriptText}"

Pleasecript and return a structured JSON response with feedback  analyze the sand score for each of the following criteria:

{
  "grammar": {
    "score": [IELTS score from 0 to 9],
    "comment": "Detailed comment on grammar and vocabulary"
  },
  "contentLogic": {
    "score": [IELTS score from 0 to 9],
    "comment": "Comment on content logic, task response and relevance"
  },
  "fluency": {
    "score": [IELTS score from 0 to 9],
    "comment": "Comment on fluency and pronunciation based on transcription patterns (e.g., repetition, hesitation)"
  }
}

Respond only in JSON format. No explanations outside JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const rawText = response.text;

    if (!rawText || rawText.trim() === "") {
      throw new Error("No text response from Gemini.");
    }

    // Xử lý JSON trả về từ Gemini
    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Gemini did not return a valid JSON.");
    }

    const jsonText = rawText.slice(jsonStart, jsonEnd + 1);
    const parsedFeedback = JSON.parse(jsonText);

    return parsedFeedback;
  } catch (error) {
    console.error("Gemini feedback error:", error);
    return {
      grammar: { score: 0, comment: "Could not get grammar feedback." },
      contentLogic: { score: 0, comment: "Could not get content feedback." },
      fluency: { score: 0, comment: "Could not get fluency feedback." },
    };
  }
}
