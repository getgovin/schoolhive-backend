import mongoose from "mongoose";

const feeCollectionSchema = new mongoose.Schema(
  {
    // School
    schoolId: {
      type:String,
      ref: "SchoolCreate",
      required: true,
      index: true,
    },

    // Student
    studentId: {
      type:String,
      ref: "StudentCreate",
      required: true,
      index: true,
    },

    classId: {
      type:String,
      ref: "ClassCreation",
      required: true,
    },

    sectionId: {
      type:String,
      ref: "SectionCreation",
    },


    // Receipt
    receiptNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    receiptDate: {
      type: Date,
      default: Date.now,
    },

    // Fee Details

    oldFees :{
    type: Number,
      default: 0,
    },
    tuitionFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    busFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    otherCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    fine: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Payment
    paymentMode: {
      type: String,
      enum: [
        "Cash",
        "UPI",
        "Cheque",
        "Bank Transfer",
      ],
      required: true,
    },

    transactionId: {
      type: String,
      trim: true,
      default: "",
    },

    receivedBy: {
      type: String,
      required: true,
      trim: true,
    },
    paidBy: {
      type: String,
      required: true,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Paid", "Cancelled"],
      default: "Paid",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FeeCollection", feeCollectionSchema);