import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import authRoutes from "../LMS_Backend/routes/authRoutes.js";
import courseRouts from "./routes/courseRoutes.js";
import sectionRoute from './routes/sectionRoute.js'
import http from 'http';
import { Server as socketIo } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new socketIo(server)

dotenv.config();

const port = process.env.PORT || 6002;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRouts);
app.use("/api/section",sectionRoute);

io.on('connection',(socket) => {
  console.log('A new user connected',socket.id);

  socket.on('send_message',(message) => {
    console.log('Recived message',message);

    io.emit('recive_message',message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    
  })
})

connectDb();

app.use(function (err, req, res, next) {
  console.log({ err });

  res.status(err.status || 500);
  res.json("error", {
    message: err.message,
    error: 'error',
    details: err.stack || {} 
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the server" });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
