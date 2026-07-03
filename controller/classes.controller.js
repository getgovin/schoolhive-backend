import { ClassCreation } from "../models/class.model.js";

const create = async (req, res) => {
  try {
    const exists = await ClassCreation.findOne({
      className: req.body.className,
    });

    if (exists) {
      return res.status(409).json({
        status: false,
        message: "Class already exists",
      });
    }
    const data = req.body;

    const newClass = ClassCreation(data);
    const response = await newClass.save();
    return res.status(201).json({
      status: true,
      message: "Class created successfully",
      data: response,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const classList = async (req, res) => {
  try {
    const { search, limit, page } = req.query;

    const pageSize = Number(limit);
    const pageCount = Number(page);

    const filter = {};
    if (search && search.trim()) {
      filter.className = {
        $regex: search,
        $options: "i",
      };
    }
    const skip = (pageCount - 1) * pageSize;
    const total = await ClassCreation.countDocuments(filter);
    const response = await ClassCreation.find(filter)
      .skip(skip)
      .limit(pageSize);
    return res.status(201).json({
      status: true,
      message: "Class Fetched successfully",
      data: response,
      total: total,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const classUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await ClassCreation.findOne({
      className: req.body.className,
      _id: { $ne: id },
    });

    if (exists) {
      return res.status(409).json({
        status: false,
        message: "Class already exists",
      });
    }

    const findClass = await ClassCreation.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!findClass) {
      return res
        .status(404)
        .json({ status: false, message: "Class not found" });
    }

    return res
      .status(200)
      .json({
        status: true,
        message: "Class updated succssfully",
        data: findClass,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const classView = async (req,res) => {
    try {
        const {id} = req.params;
        const findClass = await ClassCreation.findById(id);
         if (!findClass) {
      return res
        .status(404)
        .json({ status: false, message: "Class not found" });
    }

    return res
      .status(200)
      .json({
        status: true,
        message: "Class fetched succssfully",
        data:findClass
      });

    } catch (error) {
         return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
    }
} 

const classDelete = async (req,res) => {
    try {
        const {id} = req.params;
        const findClass = await ClassCreation.findByIdAndDelete(id);
         if (!findClass) {
      return res
        .status(404)
        .json({ status: false, message: "Class not found" });
    }

    return res
      .status(200)
      .json({
        status: true,
        message: "Class deleted succssfully",
      });

    } catch (error) {
         return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
    }
}
export { create, classList , classUpdate , classDelete , classView};
