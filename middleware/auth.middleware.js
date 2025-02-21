import jwt from "jsonwebtoken";
import { verifyToken } from "../services/user.service.js";

export const authenticatedUser = async (req, res, next) => {
  try {
    const token = req.cookies.Authorization;
    // console.log("token from middleware", token);

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const decode = verifyToken(token);
    // console.log("Decoded token:", decode);

    if (!decode?.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.userId = decode?.userId;
    req.role = decode?.role;

    // console.log("user id:", req.userId);

    next();
  } catch (error) {
    console.log({error})
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token has expired, please log in again" });
    }
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
