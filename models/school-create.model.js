import mongoose from "mongoose";
import passwordPlugin from "../plugin/passport.plugin.js";

const schoolCreateSchema = new mongoose.Schema({
  schoolLogo: {
      type: String,
      required: true,
    },
  school_details: {
  
    schoolName: {
      type: String,
      required: true,
    },
    schoolCode: {
      type: Number,
      required: true,
      unique: true,
    },
    schoolUDISECode: {
      type: String,
      required: true,
      unique: true,
    },
    schoolDISECode: {
      type: String,
      required: true,
      unique: true,
    },
    schoolEmail: {
      type: String,
      required: true,
      unique: true,
    },
    schoolPhone: {
      type: Number,
      required: true,
      unique: true,
    },
    school_address: {
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    school_subscription: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    schoolBoardType: {
      type: String,
      required: true,
    },
   
  },
  school_director_details: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    primaryNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    secondaryNumber: {
      type: Number,
    },
    whatsAppNumber: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    position: {
      type: String,
      required: true,
    },
  },
   password: {
      type: String,
      required: true,
    },
});

schoolCreateSchema.plugin(passwordPlugin)

const SchoolCreate =  mongoose.model("schools" , schoolCreateSchema)

export {SchoolCreate} ;