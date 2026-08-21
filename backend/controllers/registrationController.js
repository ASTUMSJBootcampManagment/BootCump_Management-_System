const User=require("../models/userModel")
const bcrypt= require ("bcrypt")
exports.register= async(req,res)=>{
    try{
        const{email,password,name}=req.body
        const user= await User.findOne({email})
        if(user){
            return res.send("user already exist")
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ 
            email, 
            password: hashedPassword,
            role:"Student",
            name
        });
         await newUser.save(); 
         return res.send("student has been registered successfully")
        
    }

    catch(error){
        res.send(error);
        

    }

}
exports.registerMentor = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.send("user already exist");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newMentor = new User({ 
            email, 
            password: hashedPassword,
            role: "Mentor",
            name
        });
        await newMentor.save(); 
        return res.send("mentor has been registered successfully");
    }
    catch (error) {
        res.send(error);
    }
};