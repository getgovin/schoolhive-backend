import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const generateReceipt = async (fee) => {
  return new Promise((resolve, reject) => {
    try {
      // Create Folder
      const receiptFolder = path.join("uploads", "receipts");

      if (!fs.existsSync(receiptFolder)) {
        fs.mkdirSync(receiptFolder, { recursive: true });
      }

      const outputPath = path.join(
        receiptFolder,
        `${fee.receiptNo}.pdf`
      );

      // Create PDF
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
      });

      doc.pipe(fs.createWriteStream(outputPath));

      // Colors
      const primary = "#1E40AF";
      const light = "#EFF6FF";
      const black = "#111827";

      // Page Width
      const pageWidth = doc.page.width - 80;

      // ===========================
      // HEADER
      // ===========================

      doc.roundedRect(40, 40, pageWidth, 90, 8)
        .fill(primary);

      // SH LOGO
      doc
        .circle(75, 85, 25)
        .fill("white");

      doc
        .fillColor(primary)
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("SH", 63, 77);

      doc.fillColor("white");

      doc
        .fontSize(22)
        .text("SchoolHive", 110, 60);

      doc
        .fontSize(11)
        .font("Helvetica")
        .text("School Management System", 110, 88);

      doc
        .text("Indore, Madhya Pradesh", 110, 103);

      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("FEE RECEIPT", 390, 60);

      doc
        .fontSize(11)
        .font("Helvetica")
        .text(`Receipt No : ${fee.receiptNo}`, 390, 90);

      doc.text(
        `Date : ${new Date().toLocaleDateString("en-IN")}`,
        390,
        108
      );
      // ======================================
// STUDENT DETAILS
// ======================================

let startY = 160;

doc
  .roundedRect(40, startY, pageWidth, 30, 5)
  .fill(light);

doc
  .fillColor(primary)
  .font("Helvetica-Bold")
  .fontSize(14)
  .text("Student Details", 50, startY + 8);

startY += 45;

// Outer Border
doc
  .lineWidth(1)
  .strokeColor("#D1D5DB")
  .rect(40, startY, pageWidth, 90)
  .stroke();

// Row 1
doc
  .fillColor(black)
  .font("Helvetica-Bold")
  .fontSize(11)
  .text("Student Name", 50, startY + 12);

doc
  .font("Helvetica")
  .text(fee.studentName || "-", 170, startY + 12);

doc
  .font("Helvetica-Bold")
  .text("Father Name", 350, startY + 12);

doc
  .font("Helvetica")
  .text(fee.fatherName || "-", 450, startY + 12);

// Row 2

doc
  .font("Helvetica-Bold")
  .text("Class", 50, startY + 45);

doc
  .font("Helvetica")
  .text(fee.className || "-", 170, startY + 45);

doc
  .font("Helvetica-Bold")
  .text("Section", 350, startY + 45);

doc
  .font("Helvetica")
  .text(fee.sectionName || "-", 450, startY + 45);

        // ======================================
// FEE DETAILS
// ======================================

startY += 120;

doc
  .roundedRect(40, startY, pageWidth, 30, 5)
  .fill(light);

doc
  .fillColor(primary)
  .font("Helvetica-Bold")
  .fontSize(14)
  .text("Fee Details", 50, startY + 8);

startY += 45;

// Table Layout
const tableX = 40;
const col1 = 40;
const col2 = 350;
const col3 = 150;

const rowHeight = 32;

// Header
doc
  .rect(tableX, startY, pageWidth, rowHeight)
  .fill(primary);

doc.fillColor("white");

doc.text("#", tableX + 15, startY + 10);

doc.text("Description", tableX + col1, startY + 10);

doc.text("Amount", tableX + col1 + col2, startY + 10, {
  width: col3 - 20,
  align: "right",
});

startY += rowHeight;

const feeRows = [
  {
    title: "Tuition Fee",
    amount: fee.tuitionFee,
  },
  {
    title: "Bus Fee",
    amount: fee.busFee,
  },
  {
    title: "Old Fee",
    amount: fee.oldFee,
  },
  {
    title: "Other Charges",
    amount: fee.otherCharge,
  },
  {
    title: "Fine",
    amount: fee.fine,
  },
  {
    title: "Discount",
    amount: fee.discount,
  },
];

feeRows.forEach((item, index) => {

  if (index % 2 === 0) {

    doc
      .rect(tableX, startY, pageWidth, rowHeight)
      .fill("#FAFAFA");

  }

  doc
    .strokeColor("#E5E7EB")
    .rect(tableX, startY, pageWidth, rowHeight)
    .stroke();

  doc
    .fillColor("#111827")
    .font("Helvetica")
    .fontSize(11);

  doc.text(index + 1, tableX + 15, startY + 10);

  doc.text(item.title, tableX + col1, startY + 10);

  doc.text(
    `₹ ${Number(item.amount || 0).toLocaleString("en-IN")}`,
    tableX + col1 + col2,
    startY + 10,
    {
      width: col3 - 20,
      align: "right",
    }
  );

  startY += rowHeight;

});

      doc
  .rect(tableX, startY, pageWidth, 38)
  .fill(primary);

doc
  .fillColor("white")
  .font("Helvetica-Bold")
  .fontSize(13);

doc.text(
  "TOTAL PAID",
  tableX + col1,
  startY + 12
);

doc.text(
  `₹ ${Number(fee.paidAmount).toLocaleString("en-IN")}`,
  tableX + col1 + col2,
  startY + 12,
  {
    width: col3 - 20,
    align: "right",
  }
);

startY += 55;

      // ======================================
// PAYMENT DETAILS
// ======================================

doc
  .roundedRect(40, startY, pageWidth, 30, 5)
  .fill(light);

doc
  .fillColor(primary)
  .font("Helvetica-Bold")
  .fontSize(14)
  .text("Payment Details", 50, startY + 8);

startY += 45;

      doc
  .strokeColor("#D1D5DB")
  .rect(40, startY, pageWidth, 70)
  .stroke();

doc
  .fillColor("#111827")
  .font("Helvetica-Bold")
  .fontSize(11);

doc.text("Payment Mode", 50, startY + 12);

doc
  .font("Helvetica")
  .text(fee.paymentMode || "-", 170, startY + 12);

doc
  .font("Helvetica-Bold")
  .text("Received By", 330, startY + 12);

doc
  .font("Helvetica")
  .text(fee.receivedBy || "-", 450, startY + 12);

// Second Row

doc
  .font("Helvetica-Bold")
  .text("Paid By", 50, startY + 42);

doc
  .font("Helvetica")
  .text(fee.paidBy || fee.fatherName || "-", 170, startY + 42);

startY += 100;

      doc
  .moveTo(40, startY)
  .lineTo(555, startY)
  .strokeColor("#E5E7EB")
  .stroke();

startY += 20;

      doc
  .fillColor(primary)
  .font("Helvetica-Bold")
  .fontSize(16)
  .text("Thank You!", 40, startY);

startY += 28;

doc
  .fillColor("#4B5563")
  .font("Helvetica")
  .fontSize(10)
  .text(
    "Thank you for your payment. Please keep this receipt for future reference. This is a computer-generated receipt and does not require a physical signature.",
    40,
    startY,
    {
      width: 350,
      lineGap: 4,
    }
  );

      doc
  .strokeColor("#9CA3AF")
  .moveTo(410, startY + 30)
  .lineTo(540, startY + 30)
  .stroke();

doc
  .fillColor("#111827")
  .font("Helvetica")
  .fontSize(10)
  .text(
    "Authorized Signature",
    425,
    startY + 40
  );

      doc
  .fontSize(9)
  .fillColor("#9CA3AF")
  .text(
    "Generated by SchoolHive School Management System",
    40,
    780,
    {
      align: "center",
      width: pageWidth,
    }
  );
      doc.end();

      resolve(outputPath);

    } catch (err) {
      reject(err);
    }
  });
};

export default generateReceipt;
