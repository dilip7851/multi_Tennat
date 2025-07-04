// import { emailSenderService } from "../services/emailService.js";

// export const sendEmailController = async (req, res) => {

//   const {  email, subject, body } = req.body;

//   if ( !email || !subject || !body) {
//     return res.status(400).json({ success: false, message: "Missing required fields" });
//   }

//   try {
//     await emailSenderService({ email, subject, body });
//     res.json({ success: true, message: "Email sent successfully" });
//   } catch (error) {
//     console.error("❌ Error sending email:", error.message);
//     res.status(500).json({ success: false, message: "Failed to send email" });
//   }
// };
