const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const { signUpUser, loginUser } = require("../controllers/userControllers.js");
const User = require("../models/user.js");
const router = express.Router();
//router mounts
router.route("/").get(async (req, res) => {
  const beta = await User.find();
  res.json(beta);
});
router.route("/").post(signUpUser); //register user in db
router.route("/login").post(loginUser); //log the user in and give token
// router.route("/profile").post(authMiddleware, updateUserProfile);//private change the profile
module.exports = router;
