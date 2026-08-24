const mongoose=require("mongoose")
const AnnouncementSchema= new mongoose.Schema({
    title:{
        "type":String,
        "required":[true,"title is required"]
    },
    content:{
        "type":String,
        "required":[true,"content is required"]   
    },
    batch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Batch',
    },
    announcedTo:{
        type: String,
        enum:["All","Student","Admin","Mentor"],
        default: "All",
},
    announcementDate:{
        type:Date,
        default:Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
}

},
{
    timestamps:true
}

);
module.exports=mongoose.model("Announcement",AnnouncementSchema);