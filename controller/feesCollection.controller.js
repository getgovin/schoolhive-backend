import FeeCollection from "../models/feeCollection.model.js";
import generateReceipt from "../utils/generateReceipt.js";
 const feeCollectionList = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search?.trim() || "";
    const paymentMode = req.query.paymentMode;
    const status = req.query.status;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;

    const filter = {
      schoolId,
    };

    if (paymentMode) {
      filter.paymentMode = paymentMode;
    }

    if (status) {
      filter.status = status;
    }

    if (fromDate || toDate) {
      filter.receiptDate = {};

      if (fromDate) {
        filter.receiptDate.$gte = new Date(fromDate);
      }

      if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        filter.receiptDate.$lte = endDate;
      }
    }

    let query = FeeCollection.find(filter)
      .populate("studentId", "studentName admissionNumber rollNo")
      .populate("classId", "className")
      .populate("sectionId", "sectionName")
      .sort({ receiptDate: -1 });

    if (search) {
      query = query.populate({
        path: "studentId",
        match: {
          $or: [
            { studentName: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    const allData = await query;

    const filteredData = allData.filter((item) => item.studentId);

    const totalRecords = filteredData.length;

    const data = filteredData.slice(
      (page - 1) * limit,
      page * limit
    );

    res.status(200).json({
      status: true,
      message: "Fee collection list fetched successfully.",
      totalRecords,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message:"Internla server error",
      error: error.message,
    });
  }
};

const feeSubmit  = async (req,res) =>{
    try {
      const {data} = req.body;

      const newFeeSubmission = new FeeCollection(data);
      const response  = await newFeeSubmission.save();

      const pdfPath = await generateReceipt({
  receiptNo: response.receiptNo,
  studentName: response.studentName,
  className: response.className,
  sectionName: response.sectionName,
  feeDetails: response.feeDetails,
  discount: response.discount,
  paidAmount: response.paidAmount,
  paymentMode: response.paymentMode,
  receivedBy: response.receivedBy,
});
response.receiptPdf = pdfPath;
await response.save();
      return   res.status(201).json({
      status: false,
      message:"Fee submission successfully",
      data :response
     });
    } catch (error) {
    return   res.status(500).json({
      status: false,
      message:"Internla server error",
      error: error.message,
    });
    }
}

const downloadReceipt = async (req, res) => {
  try {
    const fee = await FeeCollection.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        status: false,
        message: "Receipt not found",
      });
    }

    return res.download(fee.receiptPdf);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export {feeCollectionList , feeSubmit , downloadReceipt}