import { errorResponse, successResponse } from "../Utils/responseWrapper.js";
import {
  userLoginService,
  userForgotPasswordService,
  userResetPasswordService,
  UpdateSmtpService,
  verifySmtpService,
  sendEmailService,
} from "../services/userServices.js";
import message from "../Utils/message.js";
import statuscode from "../Utils/statuscode.js";

export const userLoginController = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, statuscode.BAD_REQUEST, message.MISSING_FIELDS);
    }

    const result = await userLoginService({ adminId, email, password });

    if (result.success) {
      return successResponse(res, statuscode.OK, message.LOGIN, {
        token: result.token,
        user: result.user,
      });
    } else {
      return errorResponse(res, statuscode.UNAUTHORIZED, result.message);
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    return errorResponse(
      res,
      statuscode.INTERNAL_ERROR,
      message.INTERNAL_SERVER_ERROR
    );
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const { adminId } = req.params;

    if (!email) {
      return errorResponse(res, statuscode.BAD_REQUEST, "Email is required.");
    }

    const result = await userForgotPasswordService({ adminId, email });

    if (result.success) {
      return successResponse(res, statuscode.OK, result.message);
    } else {
      return errorResponse(res, statuscode.NOT_FOUND, result.message);
    }
  } catch (error) {
    return errorResponse(res, statuscode.INTERNAL_ERROR, error.message);
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { token } = req.query;
    const { password } = req.body;

    if (!token || !password) {
      return errorResponse(res, statuscode.BAD_REQUEST, message.MISSING_FIELDS);
    }

    const result = await userResetPasswordService({ adminId, token, password });

    if (result.success) {
      return successResponse(res, statuscode.OK, result.message);
    } else {
      return errorResponse(res, statuscode.BAD_REQUEST, result.message);
    }
  } catch (error) {
    return errorResponse(res, statuscode.INTERNAL_ERROR, error.message);
  }
};


export const UpdateSmtpController = async (req, res) => {
  try {
    const { host, port, user, pass } = req.body;
    const adminId = req.adminId;

    if (!host || !port || !user || !pass) {
      return errorResponse(res, statuscode.BAD_REQUEST, message.MISSING_FIELDS);
    }

    const result = await UpdateSmtpService(
      req,
      host,
      port,
      user,
      pass,
      adminId
    );

    if (result.success) {
      return successResponse(res, statuscode.OK, message.SMTP_UPDATED);
    } else {
      return errorResponse(res, statuscode.BAD_REQUEST, result.message);
    }
  } catch (error) {
    return errorResponse(res, statuscode.INTERNAL_ERROR, error.message);
  }
};

export const verifySmtpController = async (req, res) => {
  try {
    const { host, port, user } = req.body;

    if (!host || !port || !user) {
      return errorResponse(res, statuscode.BAD_REQUEST, message.MISSING_FIELDS);
    }

    const result = await verifySmtpService({ host, port, user });

    if (result.success) {
      return successResponse(res, statuscode.OK, message.SMTP_VERIFIED);
    } else {
      return errorResponse(res, statuscode.BAD_REQUEST, result.message);
    }
  } catch (error) {
    return errorResponse(res, statuscode.INTERNAL_ERROR, error.message);
  }
};

export const sendEmailController = async (req, res) => {
  try {
    const { to, subject, body } = req.body;
     const attachments = req.files || [];
    const adminId = req.adminId;
    const userId = req.user._id.toString();

    if (!to || !subject || !body) {
      return errorResponse(res, statuscode.BAD_REQUEST, message.MISSING_FIELDS);
    }
  
   const formattedAttachments = attachments.map((file) => ({
      filename: file.originalname || "file",
      content: file.buffer,
      contentType: file.mimetype || "application/octet-stream",
    }));



    const result = await sendEmailService(
      req,
      to,
      subject,
      body,
      formattedAttachments,
      adminId,
      userId,
      res,
    );
    
    if (result.success) {
      return successResponse(res, statuscode.OK, result.message);
    } else {
      return errorResponse(res, statuscode.BAD_REQUEST, result.message);
    }
  } catch (error) {
    return errorResponse(res, statuscode.INTERNAL_ERROR, error.message);
  }
};
