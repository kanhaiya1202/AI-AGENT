import { GoogleGenerativeAI } from "@google/generative-ai";


// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const generateResult = async (prompt) => {
  const result = await model.generateContent(prompt)
  return result.response.text();
};