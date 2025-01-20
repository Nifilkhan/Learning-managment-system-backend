import jwt from "jsonwebtoken";

export const authenticatedUser = (req, res, next) => {
  try {
    const token = req.cookies.Authorization;
    console.log('token from middleware',token)

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denided,No token provided" });
    }

    const decode = jwt.verify(token,process.env.JWT_SECRET);

    console.log('user decoded value',decode)

    req.user = {id:decode.userId};

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired, please log in again" });
    }
    res.status(500).json({ message: "Internal server error",error:error.message});
  }
};


