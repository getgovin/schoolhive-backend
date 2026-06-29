import mongoose from "mongoose";

const feesSchema  = new mongoose.Schema({
    classId:{
        type:String,
        required:true
    },
    fee:{
        type:Number,
        required:true
    }
})

const FeesCreation = mongoose.model("fees" , feesSchema)


export {FeesCreation};