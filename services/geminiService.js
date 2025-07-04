// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const generateEmailService = async (topic, tone) => {
//   const MODEL_NAME = "gemini-1.5-flash"; 
  
  
//   const prompt = `
// Generate a professional email in ${tone} tone about: ${topic}.
// Follow these guidelines:
// 1. Subject line should be clear and concise (max 8-10 words)
// 2. Email body should be well-structured with paragraphs
// 3. Use simple, professional language
// 4. Keep length between 100-200 words

// Return response as valid JSON ONLY (no markdown):
// {
//   "subject": "Email subject here", 
//   "body": "<p>Email content in HTML format</p>"
// }
//   `;

//   try {
//     const model = genAI.getGenerativeModel({ 
//       model: MODEL_NAME,
//       generationConfig: {
//         maxOutputTokens: 800, // Limit length for faster response
//         temperature: 0.7, // Balance creativity and focus
//       },
//     });

//     const result = await model.generateContent(prompt, {
//       timeout: 10000, // 10 second timeout
//     });

//     const responseText = result.response.text();
//     const cleanJson = responseText.replace(/```json|```/g, "").trim();
    
//     return JSON.parse(cleanJson);
//   } catch (error) {
//     console.error("Generation error:", error);
//     throw new Error("Failed to generate email. Please try again.");
//   }
// };