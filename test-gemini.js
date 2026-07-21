import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'Find the EXACT video duration and title of the YouTube video at https://youtu.be/OGY_YoLLqHk using Google Search.',
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  console.log(JSON.stringify(response, null, 2));
}
run().catch(console.error);
