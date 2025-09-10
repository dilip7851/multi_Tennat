import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDBConnection } from "../Config/DbManager.js";
import { UserModel } from "../Model/UserModel.js";
import message from "../Utils/message.js";
import randomstring from "randomstring";
import { sendResetPasswordEmail } from "../middlewares/nodemailer.js";
import nodemailer from "nodemailer";
import cryptr from "../Utils/cryptr.js";

const generateWebToken = (data) => {
  try {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "365d" });
  } catch (error) {
    console.log("JWT Generate Error:", error.message);
    return null;
  }
};

export const userLoginService = async ({ adminId, email, password }) => {
  const connection = await getDBConnection(adminId);
  const User = UserModel(connection);

  const user = await User.findOne({ email }).select("+password");
  if (!user) return { success: false, message: message.NOT_FOUND };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { success: false, message: message.INVALID_CREDENTIALS };

  const token = generateWebToken({
    _id: user._id,
    email,
    adminId,
    userName: user.userName,
  });
  if (!token) return { success: false, message: message.AUTH_TOKEN_REQUIRED };

  return {
    success: true,
    token,
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      mobileNo: user.mobileNo,
    },
  };
};

export const userForgotPasswordService = async ({ adminId, email }) => {
  const connection = await getDBConnection(adminId);
  const User = UserModel(connection);

  const user = await User.findOne({ email });

  if (!user) return { success: false, message: message.NOT_FOUND };

  const token = randomstring.generate();
  await User.updateOne({ _id: user._id }, { $set: { token } });

  sendResetPasswordEmail({
    toEmail: user.email,
    token,
    adminId,
  }).catch((err) => {
    console.error("Email sending failed:", err);
  });
  return { success: true, message: message.Reset_password_email_sent };
};

export const userResetPasswordService = async ({
  adminId,
  token,
  password,
}) => {
  const connection = await getDBConnection(adminId);
  const User = UserModel(connection);

  const user = await User.findOne({ token });

  if (!user) return { success: false, message: "Invalid or expired token." };

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.updateOne(
    { _id: user._id },
    { $set: { password: hashedPassword, token: "" } }
  );

  return { success: true, message: message.PASSWORD_UPDATED };
};




export const UpdateSmtpService = async (
  req,
  host,
  port,
  user,
  pass,
  adminId
) => {
  const connection = await getDBConnection(adminId);
  const User = UserModel(connection);
  
  const encryptedPassword = cryptr.encrypt(pass);

  const updatedUser = await User.findOneAndUpdate(
    { email: req.user.email },
    {
      $set: {
        "smtp.host": host,
        "smtp.port": port,
        "smtp.user": user,
        "smtp.pass": encryptedPassword,
      },
    },
    { new: true }
  );

  if (!updatedUser) {
    return { success: false, message: message.SMTP_UPDATE_FAILED };
  }

  return { success: true, message: message.SMTP_UPDATED };
};

export const verifySmtpService = async ({ host, port, user }) => {

 try {
    const transporter = nodemailer.createTransport({
      host,
      port,
       secure: port === 465, 
      auth: {
        user,
        pass,
      },
    });
    await transporter.verify();
    return { success: true, message: "SMTP verified successfully" };
  } catch (err) {
    return { success: false, message: "Invalid SMTP credentials" };
  }

  // if (host && port && user) {
  //   return { success: true, message: message.SMTP_VERIFIED };
  // } else {
  //   return { success: false, message: message.MISSING_FIELDS };
  // }
};


export const sendEmailService = async (
  req,
  to,
  subject,
  body,
   attachments,
  adminId,
  userId,
) => {
  const connection = await getDBConnection(adminId);
  const User = UserModel(connection);

  const user1 = await User.findById(userId).select("+smtp.pass");

  if (!user1 || !user1.smtp || !user1.smtp.pass) {
    return { success: false, message: "SMTP settings are incomplete or missing." };
  }

  const { user, pass, host, port } = user1.smtp;

  let decryptedPassword;
  try {
    decryptedPassword = cryptr.decrypt(pass);
  } catch (err) {
    return { success: false, message: "Failed to decrypt SMTP password." };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
     secure: port === 465,
    auth: {
      user,
      pass: decryptedPassword,
    },
  });

  const formattedBody = body
    .replace(/\n/g, "<br>")
    .replace(/\*\s(.*?)(<br>|$)/g, "• $1<br>");

  await transporter.sendMail({
    from: `"Email Service" <${user}>`,
    to,
    subject,
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
   attachments,


  });

  return { success: true, message: "Email sent successfully." };
};
