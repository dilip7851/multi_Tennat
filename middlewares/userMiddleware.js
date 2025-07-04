import jwt from "jsonwebtoken";
import statuscode from "../Utils/statuscode.js";
import message from "../Utils/message.js";
import { errorResponse } from "../Utils/responseWrapper.js";
import { UserModel } from "../Model/UserModel.js";
import { getDBConnection } from "../Config/DbManager.js";

const userMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(
        res,
        statuscode.UNAUTHORIZED,
        message.AUTH_TOKEN_REQUIRED
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.email || !decoded.adminId) {
      return errorResponse(res, statuscode.BAD_REQUEST, message.UNAUTHORIZED);
    }

    const connection = await getDBConnection(decoded.adminId);
    const User = UserModel(connection);

    const user = await User.findOne({ email: decoded.email }).select(
      "+password"
    );
   

    if (!user) {
      return errorResponse(
        res,
        statuscode.UNAUTHORIZED,
        message.USER_NOT_FOUND
      );
    }

    req.user = user;
    req.adminId = decoded.adminId;

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return errorResponse(res, statuscode.UNAUTHORIZED, message.UNAUTHORIZED);
  }
};

export default userMiddleware;
