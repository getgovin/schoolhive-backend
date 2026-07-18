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
// ================= HEADER =================
doc
  .roundedRect(40, 40, pageWidth, 90, 8)
  .fill(primary);

// ===== Left Logo =====
doc
  .circle(75, 85, 25)
  .fill("white");

doc
  .fillColor(primary)
  .font("Helvetica-Bold")
  .fontSize(20)
  .text("SH", 63, 77);

// ===== Center School Details =====
doc.fillColor("white");

// School Name
doc
  .font("Helvetica-Bold")
  .fontSize(22)
  .text("Sunrise Public School", 0, 58, {
    width: doc.page.width,
    align: "center",
  });

// School Location
doc
  .font("Helvetica")
  .fontSize(11)
  .text("Indore, Madhya Pradesh", 0, 88, {
    width: doc.page.width,
    align: "center",
  });


      // ======================================
// STUDENT DETAILS
// ======================================

let startY = 160;

// Header
doc
  .roundedRect(40, startY, pageWidth, 30, 5)
  .fill(light);

doc
  .fillColor(primary)
  .font("Helvetica-Bold")
  .fontSize(14)
  .text("Student Details", 50, startY + 8);

startY += 45;

const studentRowHeight = 34;

// Outer Border
doc
  .lineWidth(1)
  .strokeColor("#D1D5DB")
  .rect(40, startY, pageWidth, studentRowHeight * 4)
  .stroke();

// Horizontal Lines
for (let i = 1; i < 4; i++) {
  doc
    .moveTo(40, startY + studentRowHeight * i)
    .lineTo(40 + pageWidth, startY + studentRowHeight * i)
    .stroke();
}

// Vertical Line (Center)
doc
  .moveTo(300, startY)
  .lineTo(300, startY + studentRowHeight * 4)
  .stroke();

doc
  .fillColor("#111827")
  .fontSize(10);

// ===================== Row 1 =====================
doc
  .font("Helvetica-Bold")
  .text("Student Name", 50, startY + 11);

doc
  .font("Helvetica")
  .text(fee.studentName || "-", 150, startY + 11, {
    width: 130,
    lineBreak: false
  });

doc
  .font("Helvetica-Bold")
  .text("Father Name", 315, startY + 11);

doc
  .font("Helvetica")
  .text(fee.fatherName || "-", 430, startY + 11);

// ===================== Row 2 =====================
doc
  .font("Helvetica-Bold")
  .text("Class", 50, startY + studentRowHeight + 11);

doc
  .font("Helvetica")
  .text(fee.className || "-", 150, startY + studentRowHeight + 11);

doc
  .font("Helvetica-Bold")
  .text("Section", 315, startY + studentRowHeight + 11);

doc
  .font("Helvetica")
  .text(fee.section || "-", 430, startY + studentRowHeight + 11);

// ===================== Row 3 =====================
doc
  .font("Helvetica-Bold")
  .text("Receipt No.", 50, startY + studentRowHeight * 2 + 11);

doc
  .font("Helvetica")
  .text(fee.receiptNo || "-", 150, startY + studentRowHeight * 2 + 11);

doc
  .font("Helvetica-Bold")
  .text("Date", 315, startY + studentRowHeight * 2 + 11);

doc
  .font("Helvetica")
  .text(
    new Date(fee.paymentDate || Date.now()).toLocaleDateString("en-IN"),
    430,
    startY + studentRowHeight * 2 + 11
  );



startY += studentRowHeight * 3 + 20;

        // ======================================
// FEE DETAILS
// ======================================

startY += 155;

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

const col1 = 35;   // #
const col2 = 250;  // Description (smaller)
const col3 = 215;  // Amount (wider)

const rowHeight = 28;


doc
  .lineWidth(1)
  .strokeColor("#D1D5DB")
  .rect(tableX, startY, pageWidth, rowHeight)
  .stroke();

doc
  .fillColor("#111827")
  .font("Helvetica-Bold")
  .fontSize(10);

doc.text("#", tableX + 12, startY + 9);

doc.text("Description", tableX + col1, startY + 9);

doc.text("Amount", tableX + col1 + col2, startY + 9, {
  width: col3 - 15,
  align: "right",
});

startY += rowHeight;
const feeRows = [ { title: "Tuition Fee", amount: fee.tuitionFee, }, { title: "Bus Fee", amount: fee.busFee, }, { title: "Old Fee", amount: fee.oldFee, }, { title: "Other Charges", amount: fee.otherCharge, }, { title: "Fine", amount: fee.fine, }, { title: "Discount", amount: fee.discount, }, ];
feeRows.forEach((item, index) => {

  doc
    .lineWidth(1)
    .strokeColor("#D1D5DB")
    .rect(tableX, startY, pageWidth, rowHeight)
    .stroke();

  doc
    .fillColor("#111827")
    .font("Helvetica")
    .fontSize(10);

  doc.text(index + 1, tableX + 12, startY + 9);

  doc.text(item.title, tableX + col1, startY + 9);

  doc.text(
    Number(item.amount || 0).toLocaleString("en-IN"),
    tableX + col1 + col2,
    startY + 9,
    {
      width: col3 - 15,
      align: "right",
    }
  );

  startY += rowHeight;
});

 doc
  .lineWidth(1)
  .strokeColor("#111827")
  .rect(tableX, startY, pageWidth, rowHeight)
  .stroke();

doc
  .fillColor("#111827")
  .font("Helvetica-Bold")
  .fontSize(11);

doc.text("TOTAL PAID", tableX + col1, startY + 9);

doc.text(
  Number(fee.paidAmount || 0).toLocaleString("en-IN"),
  tableX + col1 + col2,
  startY + 9,
  {
    width: col3 - 15,
    align: "right",
  }
);

      // ======================================
// PAYMENT DETAILS
// ======================================

// ================= PAYMENT DETAILS =================
startY += 45;
const paymentRowHeight = 28;

// Outer Border
doc
  .lineWidth(1)
  .strokeColor("#D1D5DB")
  .rect(40, startY, pageWidth, paymentRowHeight * 2)
  .stroke();

// Horizontal Line
doc
  .moveTo(40, startY + paymentRowHeight)
  .lineTo(40 + pageWidth, startY + paymentRowHeight)
  .stroke();

// Vertical Line
doc
  .moveTo(300, startY)
  .lineTo(300, startY + paymentRowHeight * 2)
  .stroke();

doc
  .fillColor("#111827")
  .font("Helvetica-Bold")
  .fontSize(10);

doc.text("Payment Mode", 50, startY + 9);

doc
  .font("Helvetica")
  .text(fee.paymentMode || "-", 150, startY + 9);

doc
  .font("Helvetica-Bold")
  .text("Received By", 315, startY + 9);

doc
  .font("Helvetica")
  .text(fee.receivedBy || "-", 430, startY + 9);

// Second Row
doc
  .font("Helvetica-Bold")
  .text("Paid By", 50, startY + paymentRowHeight + 9);

doc
  .font("Helvetica")
  .text(
    fee.paidBy || fee.fatherName || "-",
    150,
    startY + paymentRowHeight + 9
  );

startY += paymentRowHeight * 2 + 20;
startY += 100;



doc
  .fillColor("#4B5563")
  .font("Helvetica")
  .fontSize(10)
  .text(
    "Thank you for your payment. Please keep this receipt for future reference. This is a computer-generated receipt and does not require a physical signature.",
    20,
    startY,
    {
      width: 300,
      lineGap: 3,
    }
  );
 

 doc
  .fillColor("#9CA3AF")
  .font("Helvetica")
  .fontSize(8)
  .text(
    "Generated by SchoolHive School Management System",
    40,
    785,
    {
      width: pageWidth,
      align: "center",
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
