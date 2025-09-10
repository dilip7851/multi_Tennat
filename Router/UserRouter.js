import express from "express";
import {
  userLoginController,
  forgotPasswordController,
  resetPasswordController,
  UpdateSmtpController,
  verifySmtpController,
  sendEmailController
} from "../controllers/userController.js";
import userMiddleware from "../middlewares/userMiddleware.js";
import multer from "multer";
const upload = multer();

const UserRouter = express.Router();

UserRouter.post("/:adminId/login", userLoginController);
UserRouter.post("/:adminId/forgotPassword", forgotPasswordController);
UserRouter.post("/:adminId/reset-password", resetPasswordController);
UserRouter.post("/smtp", userMiddleware, UpdateSmtpController);
UserRouter.post("/smtpVerify", userMiddleware, verifySmtpController);
UserRouter.post(
  "/send-email",
  userMiddleware,
  upload.array("attachments"),
  sendEmailController
);

export default UserRouter;
