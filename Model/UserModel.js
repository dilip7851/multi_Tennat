import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    token:{
      type:String,
      default:"",
    },
    smtp: {
      host: { type: String, default: 'smtp.gmail.com' },
      port: { type: Number, default: 465 },
      user: { type: String },
      
      pass: { type: String, select: false },
    },
    
  },
  { timestamps: true }
);

export const UserModel = (connection) => {
  return connection.model('User', userSchema);
};

