import bcrypt from 'bcryptjs';
import AdminModel from '../Model/AdminModel.js';
import message from '../Utils/message.js';
import generateToken from '../middlewares/generateToken.js';
import { getDBConnection } from '../Config/DbManager.js';
import { UserModel } from '../Model/UserModel.js';
import { sendWelcomeEmail } from '../Utils/sendEmail.js';


export const registerAdminService = async ({ userName, email, mobileNo, password }) => {

  const existingAdmin = await AdminModel.findOne({ email });
  if (existingAdmin) {
    return { success: false ,message: message.ALREADY_REGISTERED_ADMIN };
  }

 const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = new AdminModel({
    userName,
    email,
    mobileNo,
    password: hashedPassword,
  });

  const savedAdmin = await newAdmin.save();

  const token = generateToken({ adminId: savedAdmin._id });

  return {
    success: true,
    token,
    admin: {
      id: savedAdmin._id,
      userName: savedAdmin.userName,
      email: savedAdmin.email,
      mobileNo: savedAdmin.mobileNo,
    },
  };
};


export const loginAdminService = async ({ email, password }) => {

if (!email || !password) {
  return { success:false,message: message.MISSING_FIELDS}
}
  const admin = await AdminModel.findOne({ email }).select('+password');
  if (!admin) {
    return { success: false,message: message.INVALID_LOGIN };
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return { success: false, message:message.INVALID_LOGIN };
  }  

  const token = generateToken({ adminId: admin._id });

  return {
    success: true,
    token,
    admin: {
      id: admin._id,
      userName: admin.userName,
      email: admin.email,
      mobileNo: admin.mobileNo,
    },
  };
};

export const createUserAdminService = async ({ adminId, userName, email, mobileNo }) => {
  
  const connection = await getDBConnection(adminId);
  const User = UserModel(connection);

  const existingUser = await User.findOne({ email });

  if (existingUser) throw new Error(message.ALREADY_REGISTERED);

  const currentYear = new Date().getFullYear();
  const formattedName = userName[0].toUpperCase() + userName.slice(1).toLowerCase();
  const password = `${formattedName}@${currentYear}`;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    userName,
    email,
    mobileNo,
    password: hashedPassword,
  });

  const savedUser = await newUser.save();

  await sendWelcomeEmail(userName,email, password); 

  return {
    success: true,
    user: {
      id: savedUser._id,
      userName: savedUser.userName,
      email: savedUser.email,
      mobileNo: savedUser.mobileNo,
    },
  };
};


export const getUsersByAdminService = async (adminId) => {
  const connection = await getDBConnection(adminId);
  const User = UserModel(connection);

  const users = await User.find().select('-password'); 
  return { success: true, users };
};


export const deleteUserByAdminService = async (adminId, userId) => {

  const connection = await getDBConnection(adminId);
  const User = UserModel(connection);

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return { success: false, message: message.NOT_FOUND };
  }
  return { success: true, message: message.USER_DELETED };
};