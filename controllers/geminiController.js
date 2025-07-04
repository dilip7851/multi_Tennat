// import { generateEmailService } from "../services/geminiService.js";

// export const generateEmailController = async (req, res) => {
//   const { topic, tone } = req.body;

//   try {
//     const { subject, body } = await generateEmailService(topic, tone);
//     res.json({
//       success: true,
//       message: "Email generated successfully",
//       subject,
//       body,
//     });
//   } catch (error) {
//     console.error("❌ Gemini email error:", error.message);
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to generate email" });
//   }
// };

// import { generateEmailService } from "../services/geminiService.js";

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const streamEmailController = async (req, res) => {
//   const { topic, tone } = req.query;

//   if (!topic || !tone) {
//     return res.status(400).json({ success: false, message: "Missing topic or tone" });
//   }

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//     const prompt = `
// Generate a complete professional job application email based on the topic: "${topic}" using a ${tone} tone. Fill all placeholders like [Your Name], [Company Name], etc., with realistic example data.

// Return in JSON format like:
// {
//   "subject": "Subject line here",
//   "body": "Plain text email body here, not HTML"
// }
// `;

//     const result = await model.generateContentStream(prompt);

//     res.setHeader("Content-Type", "text/event-stream");
//     res.setHeader("Cache-Control", "no-cache");
//     res.setHeader("Connection", "keep-alive");

//     for await (const chunk of result.stream) {
//       const text = chunk.text();
//       console.log(text);

//       res.write(`data: ${text}\n\n`);
//     }

//     res.write("event: end\ndata: done\n\n");
//     res.end();
//   } catch (err) {
//     console.error("Stream Error:", err.message);
//     res.write("event: error\ndata: ${err.message}\n\n"); // send error detail to client too
//     res.end();
//   }
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
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
Generate a complete professional email based on the topic: "${topic}" using a ${tone} tone. 
Fill all placeholders like [Your Name], [Company Name], etc., with realistic example data.

Return in valid JSON format with these exact keys:
{
  "subject": "Subject line here",
  "body": "Plain text email body here (no HTML, just text with line breaks)"
}

`;

      const result = await model.generateContentStream(prompt);

      let fullResponse = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;

        socket.emit("email_chunk", chunkText);
      }

      try {
        let cleanResponse = fullResponse
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const jsonResponse = JSON.parse(cleanResponse);

        if (!jsonResponse.subject || !jsonResponse.body) {
          throw new Error("Invalid response format from Gemini");
        }
        socket.emit("email_done", jsonResponse);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Original response:", fullResponse);
        socket.emit(
          "email_error",
          "Failed to generate properly formatted email. Please try again."
        );
      }
    } catch (error) {
      console.error("Gemini error:", error);
      socket.emit("email_error", error.message || "Failed to generate email");
    }
  });
};
