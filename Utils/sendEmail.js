import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

export const sendWelcomeEmail = async (userName, email, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Account Has Been Created - Login Details Inside",
      html: `
        <div style="max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;font-family:Arial,sans-serif;">
          <h2 style="color:#2c5282;">Welcome to <span style="color:#4299e1;">MyAppName</span> 🎉</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Your account has been successfully created by the admin. Below are your login details:</p>
          
          <table style="margin-top:10px;">
            <tr>
              <td><strong>Email:</strong></td>
              <td>${email}</td>
            </tr>
            <tr>
              <td><strong>Password:</strong></td>
              <td>${password}</td>
            </tr>
          </table>

          <p style="margin-top:20px;">You can login using the link below:</p>
          <a href=${process.env.APP_URL} style="display:inline-block;padding:10px 16px;background:#3182ce;color:#fff;text-decoration:none;border-radius:5px;margin-top:10px;">🔐  Login Now</a>

          <p style="margin-top:30px;color:#555;font-size:14px;">If you did not request this account, please ignore this email.</p>
          <hr style="margin-top:30px;">
          <p style="font-size:12px;color:#888;">Sent by MyAppName • <a href="https://your-website.com" style="color:#888;">www.your-website.com</a></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};




