import mongoose from "mongoose";
import StudentCreation from "../models/studentCreation.model.js";
import FeesCreation from "../models/feesCreation.model.js";

export const promoteStudents = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { studentIds, classId, sectionId } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Please select at least one student.",
      });
    }

    // Get fee structure of promoted class
    const feeStructure = await FeesCreation.findOne({ classId });

    if (!feeStructure) {
      return res.status(404).json({
        status: false,
        message: "Fee structure not found for selected class.",
      });
    }

    // New class total fee
    const newClassFee = Number(feeStructure.totalFee || 0);

    // Get students
    const students = await StudentCreation.find({
      _id: { $in: studentIds },
    }).session(session);

    for (const student of students) {
      const currentPendingFee = Number(student.fee || 0);
      const oldFee = Number(student.studentInfo?.oldFee || 0);

      await StudentCreation.updateOne(
        { _id: student._id },
        {
          $set: {
            classID: classId,
            sectionID: sectionId,
            fee: newClassFee,
            "studentInfo.oldFee": oldFee + currentPendingFee,
          },
        },
        { session }
      );
    }

    await session.commitTransaction();

    return res.status(200).json({
      status: true,
      message: `${students.length} student(s) promoted successfully.`,
    });
  } catch (error) {
    await session.abortTransaction();

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};