import mongoose from "mongoose";

const feesSchema  = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "classes", // Model name
    required: true,
  },
    fee:{
        type:Number,
        required:true
    }
})

const FeesCreation = mongoose.model("fees" , feesSchema)


export {FeesCreation};