import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';


export const getUserById = async (userId) => {
  return User.findById(userId).select("firstName lastName email");
};

// Check if a user exists (basic validation for middleware)
export const checkUserExists = async (userId) => {
  return User.findById(userId).select("_id role");
};


export const verifyToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is correct
    } catch (error) {
      console.error("Error verifying token:", error.message);
      throw new Error("Invalid token payload"); // If token verification fails
    }
  };
  