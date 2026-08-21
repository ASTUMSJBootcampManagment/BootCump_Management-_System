const express = require("express");
const {register,registerMentor,UpdateRegistrationStatus} = require("../controllers/registrationController")
const {login}=require("../controllers/loginController")
const router = express.Router();
const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");



router.post("/register", register);
router.post("/login", login);
router.post("/registerMentor",verifyToken,restrictTo("Admin"),registerMentor)
router.post("/updateRegistration/:id",verifyToken,restrictTo("Admin"),UpdateRegistrationStatus)

console.log("Register Controller:", register); 
console.log("Login Controller:", login);


module.exports = router;