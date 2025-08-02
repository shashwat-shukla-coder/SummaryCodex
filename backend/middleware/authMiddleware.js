const jwt = require("jsonwebtoken");
const User = require("../models/user");

const middleWare = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.log("you found the error error in middle ware");
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = middleWare;
