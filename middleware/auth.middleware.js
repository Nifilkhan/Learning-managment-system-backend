import jwt from "jsonwebtoken";
import {  verifyToken } from "../services/user.service.js";

export const authenticatedUser = async(req, res, next) => {
  try {
    console.log('token in middleware',req.cookies)
    const token = req.cookies.Authorization;
    console.log('token from middleware',token)

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing or invalid" });
    }

      const decode = verifyToken(token);
      console.log("Decoded token:", decode);

      if (!decode?.userId) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      // console.log('user decoded value',decode)

      // const user = await checkUserExists(decode.userId);

      // console.log('user from decoded value in midd',user)
      // if (!user) {
      //   return res.status(401).json({ message: "User not found" });
      // }
  
      req.userId = decode?.userId;
      req.role = decode?.role;

      console.log('user id:',req.userId)
      
  

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired, please log in again" });
    }
    res.status(500).json({ message: "Internal server error",error:error.message});
  }
};


