import FeeCollection from "../models/feeCollection.model.js";
import { StudentCreation } from "../models/student.model.js";
import generateReceipt from "../utils/generateReceipt.js";
import fs from "fs";
import mongoose from "mongoose";
const feeCollectionList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search?.trim() || "";

    const filter = {};

    const query = FeeCollection.find(filter)
      .populate({
        path: "studentId",
        select: `
          fee
          studentInfo.firstName
          studentInfo.lastName
        `,
      })
      .populate("classId", "className")
      .populate("sectionId", "sectionName");

    if (search) {
      query.find({
        $or: [
          { receiptNo: { $regex: search, $options: "i" } },
          { receivedBy: { $regex: search, $options: "i" } },
          { paidBy: { $regex: search, $options: "i" } },
        ],
      });
    }

    const totalRecords = await FeeCollection.countDocuments(filter);

    const data = await query
      .sort({ receiptDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      status: true,
      totalRecords,
      page,
      limit,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


const feeCollectionByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid student ID.",
      });
    }

    const filter = {
      studentId,
    };

    const totalRecords = await FeeCollection.countDocuments(filter);

    const data = await FeeCollection.find(filter)
      .populate("studentId", "studentName admissionNumber rollNo")
      .populate("classId", "className")
      .populate("sectionId", "sectionName")
      .sort({ receiptDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      status: true,
      message: "Student fee history fetched successfully.",
      totalRecords,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
const feeSubmit = async (req, res) => {
  try {
    // extract information from body
    const { studentId, totalAmount, busFee, oldFee ,tuitionFee,otherCharge ,fine,discount} = req.body;

    const requiredAmount =
  Number(tuitionFee) +
  Number(busFee) +
  Number(oldFee) +
  Number(otherCharge) +
  Number(fine) +
  Number(discount);

if (Number(totalAmount) < requiredAmount) {
  return res.status(400).json({
    status: false,
    message: `Total amount cannot be less than ₹${requiredAmount}.`,
  });
}

    /// check student is present or not 
    const student = await StudentCreation.findById(studentId).populate({
    path: "studentInfo.classId",
    select: "className",
  })
  .populate({
    path: "studentInfo.sectionId",
    select: "section",
  });
    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student not found",
      });
    }

    // // Validate School Fee
    // if (Number(totalAmount) > Number(student.fee)) {
    //   return res.status(400).json({
    //     status: false,
    //     message:
    //       "Paid school fee cannot be greater than the remaining school fee.",
    //   });
    // }

    // Validate Bus Fee
    if (Number(busFee || 0) > Number(student.remaingBusFee || 0)) {
      return res.status(400).json({
        status: false,
        message: "Paid bus fee cannot be greater than the remaining bus fee.",
      });
    }

    // Validate Old Fee
    if (Number(oldFee || 0) > Number(student.studentInfo.oldFee || 0)) {
      return res.status(400).json({
        status: false,
        message: "Paid old fee cannot be greater than the remaining old fee.",
      });
    }




    // save  fee in history
    const newFeeSubmission = new FeeCollection(req.body);
    const response = await newFeeSubmission.save();

     // generate PDF path  
const pdfPath = await generateReceipt({

  receiptNo: response.receiptNo,

  studentName: `${student.studentInfo.firstName}
${student.studentInfo.middleName || ""}
${student.studentInfo.lastName}`.trim(),

  fatherName: student.parentsDetails.fatherName,

  className: student.studentInfo.classId.className,

  sectionName: student.studentInfo.sectionId.section,

  tuitionFee,
  busFee,
  oldFee,
  otherCharge,
  fine,
  discount,

  paidAmount: totalAmount,

  paymentMode: response.paymentMode,

  receivedBy: response.receivedBy,

  paidBy: response.paidBy || student.studentInfo.fatherName

});
    response.receiptPdf = pdfPath;
    // save repsonse on db 
    await response.save();
// update student 
// const schoolFee = Number(totalAmount) - Number(tuitionFee) - Number(otherCharge) - Number(fine) + Number(discount);
const schoolFee =
  Number(totalAmount) -
  Number(tuitionFee) -
  Number(otherCharge) -
  Number(fine) +
  Number(discount);
const busFeeAmount = Number(busFee || 0);
const oldFeeAmount = Number(oldFee || 0);

await StudentCreation.findByIdAndUpdate(studentId, {
  $set: {
    fee: Number(student.fee) - schoolFee,
    remaingBusFee: Number(student.remaingBusFee) - busFeeAmount,
    "studentInfo.oldFee":
      Number(student.studentInfo?.oldFee || 0) - oldFeeAmount,
  },
});
const downloadUrl = `${req.protocol}://${req.get("host")}/api/v1/school/fee/download/${response._id}`;

    return res.status(201).json({
      status: true,
      message: "Fee submission successfully",
      data: response,
     downloadUrl
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const downloadReceipt = async (req, res) => {
  try {
    const fee = await FeeCollection.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        status: false,
        message: "Receipt not found",
      });
    }

    if (!fee.receiptPdf || !fs.existsSync(fee.receiptPdf)) {
      return res.status(404).json({
        status: false,
        message: "Receipt PDF not found.",
      });
    }

    return res.download(
      fee.receiptPdf,
      `Receipt-${fee.receiptNo}.pdf`
    );
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
export { feeCollectionList, feeSubmit, downloadReceipt ,feeCollectionByStudent};
