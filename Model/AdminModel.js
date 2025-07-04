import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  
    

  },
  { timestamps: true },
);

const AdminModel= mongoose.model('Admin', AdminSchema);
export default AdminModel;
