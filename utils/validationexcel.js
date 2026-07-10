// ===============================
// Required Field Validation
// ===============================

export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  );
};

// ===============================
// Get Student Name
// ===============================


// ===============================
// Mobile Number Validation
// ===============================

export const isValidMobile = (mobile) => {
  if (isEmpty(mobile)) return false;

  return /^[6-9]\d{9}$/.test(String(mobile).trim());
};

// ===============================
// Gender Validation
// ===============================

export const isValidGender = (gender) => {
  if (isEmpty(gender)) return false;

  const genders = ["Male", "Female", "Other"];

  return genders.includes(String(gender).trim());
};

// ===============================
// Pincode Validation
// ===============================

export const isValidPincode = (pincode) => {
  if (isEmpty(pincode)) return false;

  return /^\d{6}$/.test(String(pincode).trim());
};

// ===============================
// Error Generator
// ===============================


export const createError = (
  row,
  field,
  value,
  message,
  rowData
) => {
      const studentName = [
    rowData["Student First Name"],
    rowData["Student Middle Name"],
    rowData["Student Last Name"],
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
  return {
    row,
    studentName,
    field,
    value,
    message,

  };
};

// ===============================
// Required Fields List
// ===============================

export const requiredFields = [
  "Student First Name",
  "Student Last Name",
  "Gender",
  "Date Of Birth",
  "Admission Number",
  "Date Of Joining",
  "Class",
  "Section",
  "Father Name",
  "Father Mobile",
  "Mother Name",
  "Village",
  "Tehsil",
  "District",
  "State",
  "Pincode",
];

// ===============================
// Check Required Fields
// ===============================

export const validateRequiredFields = (
  rowData,
  rowNumber
) => {
  const errors = [];

  for (const field of requiredFields) {
    if (isEmpty(rowData[field])) {
      errors.push(
        createError(
          rowNumber,
          field,
          "",
          `${field} is required`,
          rowData
        )
      );
    }
  }

  return errors;
};

// ===============================
// Validate Mobile Numbers
// ===============================

export const validateMobiles = (
  rowData,
  rowNumber
) => {
  const errors = [];

  if (
    !isValidMobile(rowData["Father Mobile"])
  ) {
    errors.push(
      createError(
        rowNumber,
        "Father Mobile",
        rowData["Father Mobile"],
        "Invalid mobile number",
        rowData
        
      )
    );
  }

  if (
    rowData["Mother Mobile"] &&
    !isValidMobile(rowData["Mother Mobile"])
  ) {
    errors.push(
      createError(
        rowNumber,
        "Mother Mobile",
        rowData["Mother Mobile"],
        "Invalid mobile number",
                rowData

      )
    );
  }

  if (
    rowData["Emergency Person Number"] &&
    !isValidMobile(rowData["Emergency Person Number"])
  ) {
    errors.push(
      createError(
        rowNumber,
        "Emergency Person Number",
        rowData["Emergency Person Number"],
        "Invalid mobile number",
                rowData

      )
    );
  }

  return errors;
};

// ===============================
// Validate Gender
// ===============================

export const validateGender = (
  rowData,
  rowNumber
) => {

  if (
    !isValidGender(rowData["Gender"])
  ) {
    return [
      createError(
        rowNumber,
        "Gender",
        rowData["Gender"],
        "Gender must be Male, Female or Other",
        rowData
        
      ),
    ];
  }

  return [];
};

// ===============================
// Validate Pincode
// ===============================

export const validatePincode = (
  rowData,
  rowNumber
) => {

  if (
    !isValidPincode(rowData["Pincode"])
  ) {
    return [
      createError(
        rowNumber,
        "Pincode",
        rowData["Pincode"],
        "Invalid pincode",
        rowData
        
      ),
    ];
  }

  return [];
};