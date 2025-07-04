import express from "express";
import dotenv from "dotenv";
import db from "./Config/db.js";
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import rateLimit from "express-rate-limit";
import path from 'path';
import { fileURLToPath } from 'url';
import AdminRouter from "./Router/AdminRouter.js";
import UserRouter from "./Router/UserRouter.js";
import AuthRouter from './Router/AuthRouter.js'; 
import geminiRoutes from "./Router/geminiRoutes.js";
import { Server } from "socket.io";
import  { createServer } from 'http';
import { handleGeminiStream } from "./controllers/geminiController.js";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000, 
//   max: 8,
//   message: "Too many requests from this IP, please try again after a minute.",
// });

const app = express();
// app.use(limiter);
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'frontend'))); 


app.use('/', AuthRouter); 
app.use('/admin', AdminRouter);
app.use('/user', UserRouter);
app.use('/api/gemini',geminiRoutes)


app.use((req, res) => {
  res.status(404).render('404')
});


const server=createServer(app)

let io = new Server(server);


io.on("connection", (socket) => {
  console.log("⚡⬆ Client connected :", socket.id);
  handleGeminiStream(socket); 

});


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await db();
  server.listen(PORT, () => {
    console.log(`✅ Server started on port ${PORT}`);
  });
};

startServer();
