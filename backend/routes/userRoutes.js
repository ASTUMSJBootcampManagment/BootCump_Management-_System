const express=require("express")
const router= express.Router();

router.get("/admin",(req,res)=>{
    res.json({message:"Welcome Admin"})
});
router.get("/mentor",(req,res)=>{
    res.json({message:"Welcome Mentor"})
});
router.get("/student",(req,res)=>{
    res.json({message:"Welcome student"})
});
module.exports=router;