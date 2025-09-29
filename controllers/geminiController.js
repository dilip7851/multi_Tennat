// import { GoogleGenAI } from "@google/genai";
// import dotenv from "dotenv";
// dotenv.config();

// const genAI = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// export const handleGeminiStream = (socket) => {
//   socket.on("generate_email", async ({ topic, tone }) => {
//     if (!topic || !tone) {
//       socket.emit("email_error", "Missing topic or tone");
//       return;
//     }

//     try {
//       const prompt = `
// Generate a complete professional email based on the topic: "${topic}" using a ${tone} tone. 
// Fill all placeholders like [Your Name], [Company Name], etc., with realistic example data.

// Return in valid JSON format with these exact keys:
// {
//   "subject": "Subject line here",
//   "body": "Plain text email body here (no HTML, just text with line breaks)"
// }
// `;

//       const stream = await genAI.models.generateContentStream({
//         model: "gemini-2.0-flash-001",     //gemini-1.5-flash 
//        contents: [{ role: "user", parts: [{ text: prompt }] }],
//       });

//       let fullResponse = "";

//       for await (const chunk of stream) {
//         const text = chunk.text();
//         fullResponse += text;
//         socket.emit("email_chunk", text); 
//       }

//       try {
//         const clean = fullResponse
//           .replace(/```json/g, "")
//           .replace(/```/g, "")
//           .trim();

//         const parsed = JSON.parse(clean);

//         if (!parsed.subject || !parsed.body) {
//           throw new Error("Invalid format");
//         }

//         socket.emit("email_done", parsed);
//       } catch (jsonErr) {
//         console.error("Parse Error:", jsonErr);
//         socket.emit("email_error", "Failed to parse Gemini response.");
//       }
//     } catch (error) {
//       console.error("Gemini error:", error);
//       socket.emit("email_error", error.message || "Gemini stream failed.");
//     }
//   });
// };


import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 


export const handleGeminiStream = (socket) => {
  socket.on("generate_email", async ({ topic, tone }) => {
    if (!topic || !tone) {
      socket.emit("email_error", "Missing topic or tone");
      return;
    }
    try {
      const prompt = `
        Generate a complete professional email based on the topic: "${topic}" using a ${tone} tone.
        Fill all placeholders like [Your Name], [Company Name], etc., with realistic example data.
        Return in valid JSON format with these exact keys:
        {
          "subject": "Subject line here",
          "body": "Plain text email body here (no HTML, just text with line breaks)"
        }
      `;


      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const stream = await model.generateContentStream({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      let fullResponse = "";
      for await (const chunk of stream.stream) { 
        const text = chunk.text();
        fullResponse += text;
        socket.emit("email_chunk", text);
      }

      try {
        const clean = fullResponse
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        const parsed = JSON.parse(clean);
        if (!parsed.subject || !parsed.body) {
          throw new Error("Invalid format");
        }
        socket.emit("email_done", parsed);
      } catch (jsonErr) {
        console.error("Parse Error:", jsonErr);
        socket.emit("email_error", "Failed to parse Gemini response.");
      }
    } catch (error) {
      console.error("Gemini error:", error);
      socket.emit("email_error", error.message || "Gemini stream failed.");
    }
  });
};

