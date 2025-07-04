import jwt from "jsonwebtoken";
import statuscode from "../Utils/statuscode.js";
import message from "../Utils/message.js";
import { errorResponse } from "../Utils/responseWrapper.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return errorResponse(res, statuscode.UNAUTHORIZED, message.AUTH_TOKEN_REQUIRED);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.adminId) {
      return errorResponse(res, statuscode.UNAUTHORIZED, message.UNAUTHORIZED);
    }
    req.adminId = decoded.adminId;
    next();
  } catch (err) {
    console.error("Token verify error:", err.message);
    return errorResponse(res, statuscode.UNAUTHORIZED, message.UNAUTHORIZED);
  }
};

export default authMiddleware;
