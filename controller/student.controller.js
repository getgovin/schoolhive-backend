import { StudentCreation } from "../models/student.model.js";

const studentCreate = async (req,res) =>{
    try {
          const {
      classID,
      sectionID,
      admissionNo,
      rollNo,
    } = req.body;

    // Check duplicate student
    const exist = await StudentCreation.findOne({
      classID,
      sectionID,
      $or: [
        { admissionNo },
        { rollNo },
      ],
    });

    if (exist) {
      return res.status(409).json({
        status: false,
        message:
          exist.admissionNo === admissionNo
            ? "Admission number already exists in this class and section."
            : "Roll number already exists in this class and section.",
      });
    }
         const data = {
      ...req.body,
      photo: req.file?.path,
    };  
           const newStudent  =  new StudentCreation(data);
         const response = await newStudent.save();
         res.status(201).json({status:true,message:"Student created successfully!",data:response})

    } catch (error) {
        res.status(500).json({status:false,message:"Internal server error" , error:error.message})
    }
}
const studentupdate = async (req,res) =>{
    try {
        const {id} = req.params;
          const {
      classID,
      sectionID,
      admissionNo,
      rollNo,

    } = req.body;

    // Check duplicate student
    const exist = await StudentCreate.findOne({
      classID,
      sectionID,
      id:{$ne:id},
      $or: [
        { admissionNo },
        { rollNo },
      ],
    });

    if (exist) {
      return res.status(409).json({
        status: false,
        message:
          exist.admissionNo === admissionNo
            ? "Admission number already exists in this class and section."
            : "Roll number already exists in this class and section.",
      });
    }
         const data = {
      ...req.body,
      photo: req.file?.path,
    };  
    const findStudent = StudentCreation.findByIdAndUpdate(id, data , {new:true , validator:true})
    if(!findStudent){
                 res.status(404).json({status:false,message:"Student not find"})

    }
          
       return   res.status(201).json({status:true,message:"Student updated successfully!",data:findStudent})

    } catch (error) {
        res.status(500).json({status:false,message:"Internal server error" , error:error.message})
    }
}
const studentList = async (req, res) => {
  try {
    const {
      search = "",
      classid,
      sectionid,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Search by name, admission no, roll no
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by class
    if (classid) {
      filter.classid = classid;
    }

    // Filter by section
    if (sectionid) {
      filter.sectionid = sectionid;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [students, total] = await Promise.all([
      StudentCreation.find(filter)
        .skip(skip)
        .limit(Number(limit)),
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
    } = req.query;

    const findStudent = await StudentCreation.findById(id)
    if(!findStudent){
        res.status(200).json({
      status: true,
      message: "Student not found.",
    });
    }
    return res.status(200).json({
      status: true,
      message: "Student fetched successfully.",
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
const studentdeleted = async (req, res) => {
  try {
    const {
     id
    } = req.query;

    const findStudent = await StudentCreation.findByIdAndDelete(id)
    if(!findStudent){
        res.status(200).json({
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


export {studentCreate, studentList, studentupdate , studentView , studentdeleted }