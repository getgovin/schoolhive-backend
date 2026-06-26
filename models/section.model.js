import mongoose from "mongoose";

const sectionSchema =  new mongoose.Schema({
    classId:{
        type:String,
         require:true
    } ,
    sectionName:{
        type:String,
         require:true
    }
})


const SectionCreation  =  mongoose.model("Sections" , sectionSchema)

export {SectionCreation};