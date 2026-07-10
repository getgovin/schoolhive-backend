import XLSX from "xlsx";

import { StudentCreation } from "../models/student.model.js";
import { ClassCreation } from "../models/class.model.js";
import { SectionCreation } from "../models/section.model.js";
import { FeesCreation } from "../models/fees.model.js";

import { excelDateToJSDate } from "../utils/excelDateToJSDate.js";

import {
  validateRequiredFields,
  validateMobiles,
  validateGender,
  validatePincode,
  createError,
} from "../utils/validationexcel.js";

export const importStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Please upload excel file",
      });
    }

    // ==========================
    // Read Excel
    // ==========================

    const workbook = XLSX.read(req.file.buffer, {
      type: "buffer",
    });

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const students = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
    });

    if (!students.length) {
      return res.status(400).json({
        status: false,
        message: "Excel file is empty.",
      });
    }

    // ==========================
    // Load Database Data
    // ==========================

    const [classes, sections, fees, existingStudents] =
      await Promise.all([
        ClassCreation.find(),
        SectionCreation.find(),
        FeesCreation.find(),
        StudentCreation.find(
          {},
          {
            "studentInfo.adminssion_number": 1,
          }
        ),
      ]);

    // ==========================
    // Class Map
    // key => classname
    // value => class object
    // ==========================

    const classMap = {};

    classes.forEach((item) => {
      classMap[item.className.trim().toLowerCase()] = item;
    });

    // Example

    /*
        classMap = {
            "1st": {...},
            "2nd": {...},
            "10th": {...}
        }
    */

    // ==========================
    // Section Map
    // key => classId_sectionName
    // ==========================

    const sectionMap = {};

    sections.forEach((item) => {
      const key = `${item.classId.toString()}_${item.sectionName
        .trim()
        .toLowerCase()}`;

      sectionMap[key] = item;
    });

    /*
      Example

      {
        "654654_A":{...},
        "654654_B":{...}
      }

    */

    // ==========================
    // Fee Map
    // key => classId
    // ==========================

    const feeMap = {};

    fees.forEach((item) => {
      feeMap[item.classId.toString()] = item;
    });

    // ==========================
    // Existing Admission Numbers
    // ==========================

    const admissionSet = new Set();

    existingStudents.forEach((student) => {
      admissionSet.add(
        student.studentInfo.adminssion_number.trim()
      );
    });

    // ==========================
    // Duplicate Admission
    // Inside Excel
    // ==========================

    const excelAdmissionSet = new Set();

    // ==========================
    // Final Arrays
    // ==========================

    const validStudents = [];

    const errors = [];

    // ==========================
    // Start Loop
    // ==========================

    for (let index = 0; index < students.length; index++) {

      const row = students[index];

      const rowNumber = index + 2;

      // ==========================
      // Required Field Validation
      // ==========================

      const requiredErrors = validateRequiredFields(
        row,
        rowNumber
      );

      if (requiredErrors.length) {
        errors.push(...requiredErrors);
        continue;
      }

      // ==========================
      // Gender Validation
      // ==========================

      const genderErrors = validateGender(
        row,
        rowNumber
      );

      if (genderErrors.length) {
        errors.push(...genderErrors);
        continue;
      }

      // ==========================
      // Mobile Validation
      // ==========================

      const mobileErrors = validateMobiles(
        row,
        rowNumber
      );

      if (mobileErrors.length) {
        errors.push(...mobileErrors);
        continue;
      }

      // ==========================
      // Pincode Validation
      // ==========================

      const pincodeErrors = validatePincode(
        row,
        rowNumber
      );

      if (pincodeErrors.length) {
        errors.push(...pincodeErrors);
        continue;
      }

      // ==========================
      // Read Excel Values
      // ==========================

      const className = String(row["Class"]).trim();

      const sectionName = String(row["Section"]).trim();

      const admissionNumber = String(
        row["Admission Number"]
      ).trim();

      // ==========================
      // Find Class
      // ==========================

      const classData =
        classMap[className.toLowerCase()];

      if (!classData) {

        errors.push(
          createError(
            rowNumber,
            "Class",
            className,
            "Class not found",
            row


          )
        );

        continue;

      }

      // ==========================
      // Find Section
      // ==========================

      const sectionKey =
        `${classData._id}_${sectionName.toLowerCase()}`;

      const sectionData =
        sectionMap[sectionKey];

      if (!sectionData) {

        errors.push(
          createError(
            rowNumber,
            "Section",
            sectionName,
            "Section not found for selected class",
            row
          )
        );

        continue;

      }

      // ==========================
      // Duplicate Admission Number
      // Database
      // ==========================

      if (
        admissionSet.has(admissionNumber)
      ) {

        errors.push(
          createError(
            rowNumber,
            "Admission Number",
            admissionNumber,
            "Admission number already exists",
            row
          )
        );

        continue;

      }

      // ==========================
      // Duplicate Admission Number
      // Excel
      // ==========================

      if (
        excelAdmissionSet.has(admissionNumber)
      ) {

        errors.push(
          createError(
            rowNumber,
            "Admission Number",
            admissionNumber,
            "Duplicate admission number in Excel",
            row
          )
        );

        continue;

      }

      excelAdmissionSet.add(admissionNumber);

      // ==========================
      // Find Fee Structure
      // ==========================
      const feeData =
        feeMap[classData._id.toString()];



      if (!feeData) {

        errors.push(
          createError(
            rowNumber,
            "Class Fee",
            className,
            "Fee structure not found",
            row
          )
        );

        continue;

      }

      // ==========================
      // Convert Dates
      // ==========================

      const dob =
        excelDateToJSDate(
          row["Date Of Birth"]
        );

      const joiningDate =
        excelDateToJSDate(
          row["Date Of Joining"]
        );

      if (!dob || isNaN(dob.getTime())) {

        errors.push(
          createError(
            rowNumber,
            "Date Of Birth",
            row["Date Of Birth"],
            "Invalid date",
            row
          )
        );

        continue;

      }

      if (
        !joiningDate ||
        isNaN(joiningDate.getTime())
      ) {

        errors.push(
          createError(
            rowNumber,
            "Date Of Joining",
            row["Date Of Joining"],
            "Invalid date",
            row
          )
        );

        continue;

      }

      // ==========================
      // Fee Calculation
      // ==========================

      const oldFee =
        Number(row["Old Fee"] || 0);

      const busFee =
        Number(row["Bus Fee"] || 0);

      const totalFee =
        Number(feeData.fee) +
        oldFee +
        busFee;

       // ==========================
      // Build Student Object
      // ==========================

      const student = {
        photo: "",

        fee: totalFee,

        currentFee: feeData.fee,

        studentInfo: {
          firstName: String(row["Student First Name"]).trim(),

          middleName: String(
            row["Student Middle Name"] || ""
          ).trim(),

          lastName: String(
            row["Student Last Name"]
          ).trim(),

          gender: String(row["Gender"]).trim(),

          dob: dob,

          blood_group: String(
            row["Blood Group"]
          ).trim(),

          adminssion_number: admissionNumber,

          roll_number: String(
            row["Roll Number"]
          ).trim(),

          joining_date: joiningDate,

          classId: classData._id,

          sectionId: sectionData._id,

          oldFee: oldFee,

          busFee: busFee,
        },

        parentsDetails: {
          father_name: String(
            row["Father Name"]
          ).trim(),

          father_number: String(
            row["Father Mobile"]
          ).trim(),

          father_whatsaappNumbr: String(
            row["Father WhatsApp"]
          ).trim(),

          mother_name: String(
            row["Mother Name"]
          ).trim(),

          mother_number: String(
            row["Mother Mobile"] || ""
          ).trim(),
        },

        addressInfo: {
          village: String(
            row["Village"]
          ).trim(),

          tehssil: String(
            row["Tehsil"]
          ).trim(),

          distric: String(
            row["District"]
          ).trim(),

          state: String(
            row["State"]
          ).trim(),

          pincode: String(
            row["Pincode"]
          ).trim(),

          address: String(
            row["Address"] || ""
          ).trim(),
        },

        emergency_info: {
          contact_person: String(
            row["Emergency Contact Person"] || ""
          ).trim(),

          relationshp: String(
            row["Emergency Person Relation"] || ""
          ).trim(),

          mobile_number: String(
            row["Emergency Person Number"] || ""
          ).trim(),
        },
      };

      validStudents.push(student);

      // Mark this admission number as used so later rows
      // in the same import cannot reuse it.
      admissionSet.add(admissionNumber);

    } // End For Loop

    // ==========================
    // Save Students
    // ==========================

    if (validStudents.length > 0) {
      await StudentCreation.insertMany(validStudents);
    }

    // ==========================
    // Final Response
    // ==========================

    return res.status(200).json({
      status: true,
      message:
        validStudents.length > 0
          ? `${validStudents.length} Student import completed.`
          : `${errors.length} students were not imported & ${validStudents.length} imported`,

      totalRows: students.length,

      successCount: validStudents.length,

      failedCount: errors.length,

      insertedStudents: validStudents,

      errors,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });

  }

};