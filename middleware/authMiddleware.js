import jwt from "jsonwebtoken";

export const authenticatedUser = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denided,No token provided" });
    }

    const decode = jwt.verify(token.process.env.JWT_SECRET);

    req.user = decode;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};


