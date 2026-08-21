const mongoose= require("mongoose");
const BatchSchema = new mongoose.Schema({
    name:{
       "type":String,
       "required":[true,"name is required"],
       "trim":true,
       },
    year:{
       "type":Number,
       required:[true,"year is required"],
    
    },
    startDate:{
        "type":String,
        "required":[true,"start day is required"],
        "trim":true
        
    },
    endDate:{
        "type":String,
        "required":[true,"start day is required"],
        "trim":true
   
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Active', 'Completed'],
      default: 'Active',
    },
    mentors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    students: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }],
    },
    {
        timestamps:true,
    },
)
module.exports=mongoose.model("Batch",BatchSchema)