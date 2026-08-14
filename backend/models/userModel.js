const mongoose= require("mongoose")
const userSchema= new mongoose.Schema({
    "email":{
        type:String,
        required:[true,"email is required"],
        trim:true,
        unique:true,
        lowercase:true
    },
    "password":{
        type:String,
        required:[true,"password is required"],
    },
    "role": {
    type: String,
    enum: ["Admin", "Mentor", "Student"],
    default: "Student",
  },
  "verified":{
    type:Boolean,
    default:false
  },
  "verificationCode":{
    type:String,
    default:""
  },
  verificationCodeValidation:{
    type:Number,
    select:false
  },
  forgotPasswordCode: {
    type: String,
    select: false,
  },
  forgotPasswordCodeValidation: {
    type: Number,
    select: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("user", userSchema);