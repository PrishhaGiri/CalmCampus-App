
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
};

export default auth;
