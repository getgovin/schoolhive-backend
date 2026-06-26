import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    className:{
        type:String,
        required:true
    }
})

const ClassCreation = mongoose.model("classes" , classSchema);

export {ClassCreation} ;