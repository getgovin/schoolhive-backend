import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  photo: {
    type: String,
  },
  fee:{
        type: String,

  } ,
  studentInfo: {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    dob: {
      type: Date,
      required: true,
    },
    blood_group: {
      type: String,
      required: true,
    },
    adminssion_number: {
      type: String,
      required: true,
    },
    roll_number: {
      type: String,
      required: true,
    },
    joining_date: {
      type: Date,
      required: true,
    },
    classId: {
      type: String,
      required: true,
    },
    sectionId: {
      type: String,
      required: true,
    },
  },
  parentsDetails: {
    father_name: {
      type: String,
      required: true,
    },
    father_number: {
      type: String,
      required: true,
    },
    father_whatsaappNumbr: {
      type: String,
      required: true,
    },
    father_occasion: {
      type: String,
      required: true,
    },
    mother_name: {
      type: String,
      required: true,
    },

    mother_number: {
      type: String,
    },
    mother_occasion: {
      type: String,
      required: true,
    },
  },
  addressInfo: {
    village: {
      type: String,
      required: true,
    },
    tehssil: {
      type: String,
      required: true,
    },
    distric: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
  },
  emergency_info: {
    contact_person: {
      type: String,
      required: true,
    },
    relationshp: {
      type: String,
      required: true,
    },
    mobile_number: {
      type: String,
      required: true,
    },
  },
});


const StudentCreation  =  mongoose.model("Students" , studentSchema)

export {StudentCreation}