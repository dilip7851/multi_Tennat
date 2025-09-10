import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendCustomEmail = async (email, subject, body) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const formattedBody = body
    .replace(/\n/g, '<br>')
    .replace(/\*\s(.*?)(<br>|$)/g, '• $1<br>'); 

  const mailOptions = {
    from: `"Email Service" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.5;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-image: url("https://plus.unsplash.com/premium_photo-1682309526815-efe5d6225117?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFpbHxlbnwwfHwwfHx8MA%3D%3D");
         background-position: center;
         background-repeat: no-repeat;
         background-size: cover;
        }
        .header {
          color: #2563eb;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
        .bullet-list {
          padding-left: 20px;
        }
      </style>
    </head>
    <body>

      <div class="header">
        <h2>${subject}</h2>
      </div>
      
      <div class="content">
        ${formattedBody}
      </div>
      
      <div class="footer">
        <p>Sent on ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, message: "Failed to send email" };
  }
};