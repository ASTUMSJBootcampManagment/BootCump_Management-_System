const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt=require("bcrypt")
const jwt= require("jsonwebtoken")
exports.login= async(req,res)=>{
    try{
        const{email,password}=req.body
        const user = await User.findOne({email}).select("+password");
        if(!user){
           return  await res.status(400).json("invalid credential")
        }
        const ispassword = await bcrypt.compare(password,user.password)
        if(!ispassword){
            return await res.status(400).json("invalid credential")
        }
        const token=jwt.sign(
            {id:user._id,role:user.role},
            process.env.JWT_SECRET || "your_temporary_secret_key",
            {expiresIn:"3days"}
        )
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                 id: user._id,
                 email: user.email,
                 role: user.role,
                 status:user.status
      }
    });
}
    catch(error){
        return res.status(500).json({message:error.message})
}
}
