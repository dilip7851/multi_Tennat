import mongoose from "mongoose";

const db = async () => {
  const mongoUrl = process.env.MONGO_URI;
  if (!mongoUrl) {
    throw new Error("MONGO_URI environment variable is not set.");
  }
  try {
    const connect = await mongoose.connect(mongoUrl);
    console.log("MongoDb Connected", connect.connection.host);
  } catch (error) {
    console.log(error); 
    process.exit(1);
  }
};
export default db;
