import { FeesCreation } from "../models/fees.model.js";
import { StudentCreation } from "../models/student.model.js";
import mongoose from "mongoose";

const studentCreate = async (req,res) =>{
    try {
          const {
      classId,
      adminssion_number,
    } = req.body?.studentInfo;
  
    

// Check duplicate Admission Number
const exist = await StudentCreation.findOne({
  "studentInfo.adminssion_number": adminssion_number,
});

if (exist) {
  return res.status(409).json({
    status: false,
    message: "Admission number already exists.",
  });
}

    // Get fee structure
    const addFee = await FeesCreation.findOne({ classId });
    if (!addFee) {
      return res.status(404).json({
        status: false,
        message: "Fee structure not found for this class.",
      });
    }

    const data = {
      ...req.body,
      photo: req.file?.path,
      fee: Number(addFee.fee) + Number(req.body?.studentInfo?.oldFee) +  Number(req.body?.studentInfo?.busFee),
      currentFee:Number(addFee.fee),
      remaingBusFee:Number(req.body?.studentInfo?.busFee),
      feeId:addFee?._id
    };
    
           const newStudent  =  new StudentCreation(data);
         const response = await newStudent.save();
         res.status(201).json({status:true,message:"Student created successfully!",data:response})

    } catch (error) {
        res.status(500).json({status:false,message:"Internal server error" , error:error.message})
    }
}
const studentUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const { classID, adminssion_number, oldFee = 0, busFee = 0 } =
      req.body.studentInfo;

    // Check if student exists
    const student = await StudentCreation.findById(id);

    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student not found.",
      });
    }

    // Check duplicate Admission Number (exclude current student)
    const exist = await StudentCreation.findOne({
      "studentInfo.adminssion_number": adminssion_number,
      _id: { $ne: id },
    });

    if (exist) {
      return res.status(409).json({
        status: false,
        message: "Admission number already exists.",
      });
    }

    // Get fee structure
    const addFee = await FeesCreation.findOne({ classID });

    if (!addFee) {
      return res.status(404).json({
        status: false,
        message: "Fee structure not found for this class.",
      });
    }

    const data = {
      ...req.body,
      photo: req.file ? req.file.path : student.photo,
      fee:
        Number(addFee.fee) +
        Number(oldFee) +
        Number(busFee),
      currentFee: Number(addFee.fee),
    };

    const response = await StudentCreation.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      status: true,
      message: "Student updated successfully!",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const studentList = async (req, res) => {
  try {
    const {
      search = "",
      classId,
      sectionId,
      page = 1,
      pageSize = 10,
    } = req.query;

    const filter = {};

    // Search by name, admission no, roll no
if (search) {
  filter.$or = [
    { "studentInfo.firstName": { $regex: search, $options: "i" } },
    { "studentInfo.lastName": { $regex: search, $options: "i" } },
    { "studentInfo.adminssion_number": { $regex: search, $options: "i" } },
    { "studentInfo.roll_number": { $regex: search, $options: "i" } },
  ];
}


// Filter by class
if (classId) {
  filter["studentInfo.classId"] = new mongoose.Types.ObjectId(classId);
}

// Filter by section
if (sectionId) {
  filter["studentInfo.sectionId"] = new mongoose.Types.ObjectId(sectionId);
}

    const skip = (Number(page) - 1) * Number(pageSize);
    const [students, total] = await Promise.all([
      StudentCreation.find(filter).populate("studentInfo.classId", "className")
  .populate("studentInfo.sectionId", "sectionName")
        .skip(skip)
        .limit(Number(pageSize)),
      StudentCreation.countDocuments(filter),
    ]);

    return res.status(200).json({
      status: true,
      message: "Student list fetched successfully.",
      total:total,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const studentView = async (req, res) => {
  try {
    const {
     id
    } = req.params;

    const findStudent = await StudentCreation.findById(id).populate("studentInfo.classId", "className")
  .populate("studentInfo.sectionId", "sectionName")
    if(!findStudent){
        res.status(200).json({
      status: true,
      message: "Student not found.",
    });
    }
    return res.status(200).json({
      status: true,
      message: "Student fetched successfully.",
      data: findStudent,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const studentdeleted = async (req, res) => {
  try {
    const {
     id
    } = req.params;

    const findStudent = await StudentCreation.findByIdAndDelete(id)
    if(!findStudent){
        res.status(404).json({
      status: true,
      message: "Student not found.",
    });
    }
    return res.status(200).json({
      status: true,
      message: "Student deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const studentFilterList = async (req, res) => {
  try {
    const {
      search = "",
      classId,
      sectionId,
   
    } = req.query;


       // Require at least one filter
    if (!classId && !sectionId) {
      return res.status(200).json({
        status: false,
        message: "Please select a class or section first.",
        data: [],
      });
    }

    const filter = {};

    // Search by name, admission no, roll no
if (search) {
  filter.$or = [
    { "studentInfo.firstName": { $regex: search, $options: "i" } },
    { "studentInfo.lastName": { $regex: search, $options: "i" } },
    { "studentInfo.adminssion_number": { $regex: search, $options: "i" } },
    { "studentInfo.roll_number": { $regex: search, $options: "i" } },
  ];
}


// Filter by class
if (classId) {
  filter["studentInfo.classId"] = new mongoose.Types.ObjectId(classId);
}

// Filter by section
if (sectionId) {
  filter["studentInfo.sectionId"] = new mongoose.Types.ObjectId(sectionId);
}

    const students = await StudentCreation.find(filter).populate("studentInfo.classId", "className")
  .populate("studentInfo.sectionId", "sectionName")
          ;

    return res.status(200).json({
      status: true,
      message: "Student list fetched successfully.",
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export {studentCreate, studentList, studentUpdate , studentView , studentdeleted,studentFilterList }