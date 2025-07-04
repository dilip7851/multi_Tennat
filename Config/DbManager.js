import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connections = {};

export const getDBConnection = async (adminId) => {
  
  const dbName = `admin_${adminId}`;  

  if (connections[dbName]) {
    return connections[dbName];
  }

  const baseUri = process.env.MONGO_URI;
  const fullUri = `${baseUri}${dbName}?retryWrites=true&w=majority`;

  const connection =await mongoose.createConnection(fullUri);

  connections[dbName] = connection;
  return connection;
};

