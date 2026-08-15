const express=require("express")
const router= express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

router.get("/admin",verifyToken, authorizeRoles("Admin"),(req,res)=>{
    res.json({message:"Welcome Admin"})
});
router.get("/mentor",verifyToken, authorizeRoles("Admin","Mentor"),(req,res)=>{
    res.json({message:"Welcome Mentor"})
});
router.get("/student",verifyToken, authorizeRoles("Admin","Mentor","Student"),(req,res)=>{
    res.json({message:"Welcome student"})
});
module.exports=router;