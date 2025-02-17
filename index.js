import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import authRoutes from "../LMS_Backend/routes/auth.routes.js";
import courseRouts from "./routes/course.routes.js";
import sectionRoute from './routes/section.routes.js'
import http from 'http';
import { Server as socketIo } from "socket.io";
import lecture from "./routes/lecture.routes.js";
import cartRoute from './routes/cart.routes.js'
import payment from './routes/payment.routes.js'
import Passport from "passport";
import './config/passport.config.js'
import session from 'express-session'

const app = express();

// const server = http.createServer(app);

// const io = new socketIo(server)

dotenv.config();

const port = process.env.PORT || 6002;

app.use(cors({
  origin:"http://localhost:4200",
  credentials:true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false,
  cookie:{
    httpOnly:true,
    secure:process.env.NODE_ENV === 'production',
    sameSite:'strict'
  }
}))

app.use(Passport.initialize());
app.use(Passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRouts);
app.use("/api/section",sectionRoute);
app.use("/api/lecture",lecture);
app.use("/api/course",cartRoute);
app.use("/api/payment",payment);

// io.on('connection',(socket) => {
//   console.log('A new user connected',socket.id);

//   socket.on('send_message',(message) => {
//     console.log('Recived message',message);

//     io.emit('recive_message',message);
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
    
//   })
// })

connectDb();

app.use(function (err, req, res, next) {
  console.log({ err });

  res.status(500);
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
