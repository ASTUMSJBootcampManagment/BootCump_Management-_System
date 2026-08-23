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
    "status":{
      type:String,
      enum:["pending","approved","rejected"],
      default:"pending"
    },
    "name":{
      type:String,
      required:[true,"name is required"],
      trim:true
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

module.exports = mongoose.models.user || mongoose.model("user", userSchema);

/*
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    "email": {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    "password": {
      type: String,
      required: [true, "password is required"],
    },
    "status": {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    "name": {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    "role": {
      type: String,
      enum: ["Admin", "Mentor", "Student"],
      default: "Student",
    },
    "verified": {
      type: Boolean,
      default: false,
    },
    "verificationCode": {
      type: String,
      default: "",
    },
    "verificationCodeValidation": {
      type: Number,
      select: false,
    },
    "forgotPasswordCode": {
      type: String,
      select: false,
    },
    "forgotPasswordCodeValidation": {
      type: Number,
      select: false,
    },

    "universityId": {
      type: String,
      trim: true,
      default: "",
    },
    "codeforcesAccount": {
      type: String,
      trim: true,
      default: "",
    },
    "leetcodeAccount": {
      type: String,
      trim: true,
      default: "",
    },
    "githubAccount": {
      type: String,
      trim: true,
      default: "",
    },
    "reasonToJoin": {
      type: String,
      default: "",
    },
    "telegramUsername": {
      type: String,
      trim: true,
      default: "",
    },
    "phoneNumber": {
      type: String,
      trim: true,
      default: "",
    },
    "gender": {
      type: String,
      enum: ["Male", "Female"],
    },
    "hasConstantInternet": {
      type: Boolean,
      default: false,
    },
    "hasPersonalLaptop": {
      type: Boolean,
      default: false,
    },

    // Group / Batch assignment
    "assignedBatch": {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },
    "assignedMentor": {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.user || mongoose.model("user", userSchema);
*/