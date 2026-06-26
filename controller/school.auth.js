import { SchoolCreate } from "../models/school-create.model.js";
import fs from "fs"
import { generateToken } from "../utils/jwt.js";
const schoolCreate = async (req , res) =>{
    try {
    const data = {
      ...req.body,
      schoolLogo: req.file?.path,
    };         const newSchool  = await new SchoolCreate(data);
         const response = await newSchool.save();
         res.status(201).json({status:true,message:"School created SuccessFully!",data:response})
    } catch(error){
        console.log(error)
        res.status(500).json({status:false, message:"Internal Server Error"})
    }
}
const schoolList = async (req , res) =>{
    try {
     const response = await  SchoolCreate.find();
         res.status(201).json({sstatus:true,data:response})
    } catch(error){
        console.log(error)
        res.status(500).json({status:false, message:"Internal Server Error"})
    }
}
const schoolUpdate = async (req, res) => {
  try {
    const id = req.params.id;

    const school = await SchoolCreate.findById(id);

    if (!school) {
      return res.status(404).json({
        status: false,
        message: "School not found",
      });
    }

    const updateData = {
      ...req.body,
    };

    if (req.file) {
      // Delete old logo
      if (
        school.schoolLogo &&
        fs.existsSync(school.schoolLogo)
      ) {
        fs.unlinkSync(school.schoolLogo);
      }

      // Save new logo path
      updateData.schoolLogo = req.file.path;
    }

    const updatedSchool =
      await SchoolCreate.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      status: true,
      message: "School updated successfully",
      data: updatedSchool,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
const schoolView = async (req , res) =>{
    try {
        const id = req.params.id;
        const findSchool = await SchoolCreate.findById(id)
         if (!findSchool) {
      return res.status(404).json({
        status: false,
        message: "School not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "School fetched successfully",
      data: findSchool,
    });
    } catch(error){
        console.log(error)
        res.status(500).json({status:false, message:"Internal Server Error"})
    }
}
const schoolDelete = async (req , res) =>{
    try {
        const id = req.params.id;
        const findSchool = await SchoolCreate.findByIdAndDelete(id)
         if (!findSchool) {
      return res.status(404).json({
        status: false,
        message: "School not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "School deleted successfully",
    });
    } catch(error){
        console.log(error)
        res.status(500).json({status:false, message:"Internal Server Error"})
    }
}
 const schoolLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const schooladmin = await SchoolCreate.findOne({ "school_details.schoolEmail": email });
    if (!schooladmin) {
      return res
        .status(401)
        .json({ status: false, message: "Incorrect email and password" });
    }
    const isValidpassword = await schooladmin.comparePassword(password);

    if (!isValidpassword) {
      return res
        .status(401)
        .json({ status: false, message: "Incorrect password" });
    } else {
        const payload = {
            id : schooladmin.id
        }
        const token  = generateToken(payload)
        return res.status(200).json({status:true , message:" Login Successfully" , user:schooladmin , token:token})
    }
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};
export {schoolCreate , schoolList ,schoolUpdate , schoolView ,schoolDelete ,schoolLogin}