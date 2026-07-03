import { SectionCreation } from "../models/section.model.js";

const sectionCreate = async (req, res) => {
  try {
    const exist = await SectionCreation.find({
      classId: req.body.classId,
      sectionName: req.body.sectionName,
    });


    if (exist.length > 0) {
      return res.status(409).json({
        status: false,
        message: "Section already exists in this class",
      });
    }

    const data = req.body;
    const newSection = await SectionCreation(data);
    const response = await newSection.save();
    return res
      .status(201)
      .json({ status: true, message: "Section created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const sectionList  = async  (req,res) => {
    try {
const { search, page = 1, limit = 10 } = req.query;
       const pageSize = Number(limit);
       const pageCount = Number(page);
      const filter = {} 
    if (search?.trim()) {
  filter.sectionName = {
    $regex: search.trim(),
    $options: "i",
  };
}
       const skip = (pageCount - 1) * pageSize;
       const total = await SectionCreation.countDocuments(filter)
       const repsonse = await SectionCreation.find(filter).populate("classId" , "className").skip(skip).limit(pageSize)
       return res.status(200).json({status:true , message:"Section fetcheed successfully" , data:repsonse , total:total})
    } catch (error) {
        return res.status(500).json({status:false, message :"Internal server error" , error : error.message})
    }
}


const sectionUpdate =  async (req,res) => {
    try {
      const {id} = req.params;
      const exist = await SectionCreation.find({
         classId: req.body.classId,
      sectionName: req.body.sectionName,
      id:{$ne : id}
      })
  if (exist.length > 0) {
      return res.status(409).json({
        status: false,
        message: "Section already exists in this class",
      });
    }
      const findSection   = await SectionCreation.findByIdAndUpdate(id, req.body, {
        new:true,
        validator:true
      });
      if(!findSection){
        return res.status(404).json({status:false, messsage :"Section not found"})
      }
      return res.status(200).json({status:true , message:"Section updated successfullly" , data:findSection})
    } catch (error) {
        return res.status(500).json({status:false , message:"Internal server error" , error :error.message})

    }
} 

const sectionDelete  = async (req,res) =>{
    try {
          const {id} = req.params;
          const findSection = await SectionCreation.findByIdAndDelete(id);
          if(!findSection){
        return res.status(404).json({status:false, messsage :"Section not found"})
      }
      return res.status(200).json({status:true , message:"Section deleted successfullly" })
    } catch (error) {
        return res.status(500).json({status:false , message:"Internal server error" , error :error.message})
    }

}

const sectionView = async (req,res) => {
    try { 
        const {id} = req.params;
        const findSection  = await SectionCreation.findById(id).populate("classId" , "className");
         if(!findSection){
        return res.status(404).json({status:false, messsage :"Section not found"})
      }
      return res.status(200).json({status:true , message:"Section fetched successfullly" , data:findSection})
         
    } catch (error) {
                return res.status(500).json({status:false , message:"Internal server error" , error :error.message})

    }
}

export {sectionCreate  ,sectionUpdate , sectionList , sectionView , sectionDelete}