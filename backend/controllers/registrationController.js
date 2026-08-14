const User=require("../models/userModel")
const bcrypt= require ("bcrypt")
exports.register= async(req,res)=>{
    try{
        const{email,password,role}=req.body
        const user= await User.findOne({email})
        if(user){
            return res.send("user already exist")
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ 
            email, 
            password: hashedPassword,
            role
        });
         await newUser.save(); 
         return res.send("user has been registered successfully")
        
    }

    catch(error){
        res.send(error);
        

    }

}