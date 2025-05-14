import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyB_hvma-jhZwb2gqcMMOp7nSLnovYJaxOc" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "You are a professional TOEIC Speaking evaluator.Topic: Describe a book that you like.Student's script:One of my favorite book is the Alchemist by Paulo Coelho. It's a novel originally written in Portuguese and it has become one of the most translated books in the world. I read it for the first time around three years ago when I was going through a period of uncertainty of my life. The story is about a young shepherd named Santiago who dreams of finding a treasure located somewhere in Egypt. Along his journey, he meets a number of people who guide him, including a king, a crystal merchant, an alchemist. But more than the physical treasure, the book emphasizes the importance of following someone's dreams and listening to one's heart.Please provide feedback in the following format:1. Grammar & Vocabulary: [Your comments]2. Content Logic: [Your comments],Use concise, professional language suitable for TOEIC preparation.",
  });
  console.log(response.text);
}

await main();