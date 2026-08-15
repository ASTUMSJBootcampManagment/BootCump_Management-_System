const express = require("express");
const {register} = require("../controllers/registrationController")
const {login}=require("../controllers/loginController")
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
console.log("Register Controller:", register); 
console.log("Login Controller:", login);

module.exports = router;