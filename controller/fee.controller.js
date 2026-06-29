import { FeesCreation } from "../models/fees.model.js";

const feeeCreate = async (req, res) => {
  try {
    const exist = await FeesCreation.find({
      classId: req.body.classId,
      fee: req.body.fee,
    });
    if (exist.length > 0) {
      return res
        .status(409)
        .json({ status: false, message: "Fees already exist for this class" });
    }
    const data = req.body;
    const newFee = new FeesCreation(data);
    const response = await newFee.save();
    return res
      .status(201)
      .json({
        status: true,
        message: "Fees created Successfully",
        data: response,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

const feeList = async (req, res) => {
  try {
    const { search, page, limit } = req.params;

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * 10;
    const filter = {};
    if (search && search.trim()) {
      filter.className({
        $regex: search,
        $options: "i",
      });
    }
    const total = await FeesCreation.countDocuments(filter);
    const response = await FeesCreation.find(filter);
    return res.status(200).json({status:true , message :"Fee fetched successfully" ,data:response , total:total})
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};
const feeeUpdate = async (req, res) => {
  try {
    const {id} = req.params;

    const exist = await FeesCreation.find({
      classId: req.body.classId,
      fee: req.body.fee,
      id:{$ne : id}
    });
    if (exist.length > 0) {
      return res
        .status(409)
        .json({ status: false, message: "Fees already exist for this class" });
    }
    const data = req.body;
    const findData =  await FeesCreation.findByIdAndUpdate(id, req.body , 
        {
          new:true  ,
          validator:true
        });

        if(!findData){
            return res
      .status(404)
      .json({
        status: false,
        message: "Fees entry not found",
      });
        }
   
    return res
      .status(201)
      .json({
        status: true,
        message: "Fees updated Successfully",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};
const feeeView = async (req,res) => {
  try {
    const {id } = req.params;
    const response = await FeesCreation.findById(id)
    if(!response){
          return res
      .status(404)
      .json({
        status: false,
        message: "Fees entry not found",
      });
    }
    return res.status(200).json({status:true, message :"fee fetched successfully", data:response})
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
  }
}

const feeeDelete = async (req,res) => {
  try {
    const {id } = req.params;
    const response = await FeesCreation.findByIdAndDelete(id)
    if(!response){
          return res
      .status(404)
      .json({
        status: false,
        message: "Fees entry not found",
      });
    }
    return res.status(200).json({status:true, message :"fee deleted successfully"})
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
  }
}



export {feeeCreate, feeList, feeeView, feeeUpdate , feeeDelete}