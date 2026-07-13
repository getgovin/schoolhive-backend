import mongoose from "mongoose";

const feeCollectionSchema = new mongoose.Schema(
  {
    // Student
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
      required: true,
    },

    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sections",
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

    receiptPdf: {
      type: String,
      default: "",
    },
    // Fee Details

    oldFee: {
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
      enum: ["Cash", "UPI", "Cheque", "Bank Transfer"],
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
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("FeeCollection", feeCollectionSchema);
