const mongoose=require("mongoose")
const progressSchema=new mongoose.Schema({
    topic:{
        type:String,
        required:[true,"topic is required"],
        trim:true,
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    status:{
        type:String,
        enum:["NotStarted","InProgress","Completed","NeedsImprovement"],
    },
     batch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Batch'
    },
})
module.exports=mongoose.model("progress",progressSchema);