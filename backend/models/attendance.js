const mongoose =require("mongoose");
const AttendanceSchema= new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Student ID is required"]
},
    status:{
        type:String,
        enum:["present","absent","excused","late"],
        required:[true,"status is required"],
        lowercase:true

    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, "Date is required"],
    },
    batch:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Batch",
        required:[true,"batch is required"]

        
    }
},

{
    timestamps: true,
  }
);

AttendanceSchema.index({ student: 1, batch: 1, date: 1 }, { unique: true });

module.exports =mongoose.models.Attendance ||mongoose.model("Attendance", AttendanceSchema);


