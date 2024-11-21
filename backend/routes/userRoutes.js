const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const { signUpUser, loginUser } = require("../controllers/userControllers.js");
const User = require("../models/user.js");
const router = express.Router();
//router mounts
router.route("/").post(signUpUser); //register user in db
router.route("/login").post(loginUser); //log the user in and give token
module.exports = router;
