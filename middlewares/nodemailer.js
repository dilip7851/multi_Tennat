import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export const sendResetPasswordEmail = async ({ toEmail, token, adminId }) => {
  try {
    const resetLink = `http://localhost:8000/user/${adminId}/reset-password?token=${token}`;
    const mailOptions = {
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">🔐 Reset Your Password</h2>
          <p style="color: #555;">Hi there,</p>
          <p style="color: #555;">We received a request to reset your password. Click the button below to continue:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #007bff; color: #fff; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Reset Password
            </a>
          </div>

          <p style="color: #777;">If you didn’t request this, please ignore this email. This link is valid for a limited time only.</p>
          <hr style="margin: 30px 0;" />
          <p style="color: #999; font-size: 14px; text-align: center;">
            © ${new Date().getFullYear()} Welcome to MyAppName — All Rights Reserved
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    // console.log("✅ Email sent:", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    return { success: false, error: err.message };
  }
};



