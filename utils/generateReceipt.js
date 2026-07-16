import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const generateReceipt = (fee) => {
  return new Promise((resolve, reject) => {
    const receiptFolder = path.join("uploads", "receipts");

    if (!fs.existsSync(receiptFolder)) {
      fs.mkdirSync(receiptFolder, { recursive: true });
    }

    const filePath = path.join(receiptFolder, `${fee.receiptNo}.pdf`);

    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Logo
    const logo = path.join("assets", "logo.png");

    if (fs.existsSync(logo)) {
      doc.image(logo, 40, 35, {
        width: 60,
      });
    }

    // School Details
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("ABC PUBLIC SCHOOL", 120, 40);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(
        "123, MG Road, Indore (M.P.)\nPhone : +91 9876543210\nEmail : info@abcschool.com",
        350,
        40,
        {
          align: "right",
        }
      );

    // Header Line
    doc
      .moveTo(40, 105)
      .lineTo(555, 105)
      .lineWidth(8)
      .strokeColor("#72725f")
      .stroke();

    // Receipt Title
    doc
      .moveDown(3)
      .fontSize(20)
      .fillColor("#333")
      .font("Helvetica-Bold")
      .text("School Receipt", {
        align: "center",
      });

    doc.moveDown();

    // Receipt Details

    doc.fontSize(11);

    doc.text(`Date : ${new Date().toLocaleDateString()}`, 40);

    doc.text(`Receipt No : ${fee.receiptNo}`);

    doc.moveDown();

    // Student Details

    doc.font("Helvetica-Bold");
    doc.text("Received From:");

    doc.font("Helvetica");
    doc.text(fee.studentName);

    doc.moveDown(0.3);

    doc.font("Helvetica-Bold");
    doc.text("Class:");

    doc.font("Helvetica");
    doc.text(`${fee.className} - ${fee.sectionName}`);

    doc.moveDown(0.3);

    doc.font("Helvetica-Bold");
    doc.text("Payment Mode:");

    doc.font("Helvetica");
    doc.text(fee.paymentMode);

    doc.moveDown(2);

    //-------------------------------------
    // Table Header
    //-------------------------------------

    const tableTop = doc.y;

    doc
      .rect(40, tableTop, 350, 25)
      .fill("#F3F4F6");

    doc
      .rect(390, tableTop, 125, 25)
      .fill("#F3F4F6");

    doc
      .fillColor("#000")
      .font("Helvetica-Bold")
      .fontSize(11);

    doc.text("Description", 60, tableTop + 8);

    doc.text("Amount", 430, tableTop + 8);

    //-------------------------------------
    // Table Rows
    //-------------------------------------

    let y = tableTop + 25;

    fee.feeDetails.forEach((item) => {
      doc
        .rect(40, y, 350, 25)
        .stroke("#dddddd");

      doc
        .rect(390, y, 125, 25)
        .stroke("#dddddd");

      doc.font("Helvetica");

      doc.text(item.feeName, 60, y + 8);

      doc.text(`₹ ${item.amount}`, 430, y + 8);

      y += 25;
    });

    //-------------------------------------
    // Discount
    //-------------------------------------

    if (fee.discount > 0) {
      doc
        .rect(40, y, 350, 25)
        .stroke("#ddd");

      doc
        .rect(390, y, 125, 25)
        .stroke("#ddd");

      doc.text("Discount", 60, y + 8);

      doc.text(`- ₹ ${fee.discount}`, 430, y + 8);

      y += 25;
    }

    //-------------------------------------
    // Total
    //-------------------------------------

    doc
      .rect(40, y, 350, 30)
      .fill("#eeeeee");

    doc
      .rect(390, y, 125, 30)
      .fill("#eeeeee");

    doc
      .fillColor("#000")
      .font("Helvetica-Bold");

    doc.text("Total Paid", 60, y + 9);

    doc.text(`₹ ${fee.paidAmount}`, 430, y + 9);

    //-------------------------------------
    // Payment Info
    //-------------------------------------

    doc.moveDown(6);

    doc.font("Helvetica-Bold");

    doc.text("Received By : ");

    doc.font("Helvetica");

    doc.text(fee.receivedBy);

    doc.moveDown();

    //-------------------------------------
    // Footer
    //-------------------------------------

    doc.moveDown(2);

    doc
      .fontSize(10)
      .fillColor("gray")
      .text(
        "Thank you for your payment.\nFor any query please contact the school office.",
        {
          align: "center",
        }
      );

    doc.end();

    stream.on("finish", () => resolve(filePath));

    stream.on("error", reject);
  });
};

export default generateReceipt;