import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const generateReceipt = async (fee) => {
  return new Promise((resolve, reject) => {
    const receiptFolder = path.join("uploads", "receipts");

    if (!fs.existsSync(receiptFolder)) {
      fs.mkdirSync(receiptFolder, { recursive: true });
    }

    const fileName = `${fee.receiptNo}.pdf`;
    const filePath = path.join(receiptFolder, fileName);

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // School Name
    doc
      .fontSize(20)
      .text("ABC PUBLIC SCHOOL", {
        align: "center",
      });

    doc.moveDown();

    doc.fontSize(14).text(`Receipt No : ${fee.receiptNo}`);
    doc.text(`Date : ${new Date().toLocaleDateString()}`);

    doc.moveDown();

    doc.text(`Student : ${fee.studentName}`);
    doc.text(`Class : ${fee.className}`);
    doc.text(`Section : ${fee.sectionName}`);

    doc.moveDown();

    doc.text("Fee Details");

    doc.moveDown(0.5);

    fee.feeDetails.forEach((item) => {
      doc.text(`${item.feeName} : ₹${item.amount}`);
    });

    doc.moveDown();

    doc.text(`Discount : ₹${fee.discount}`);

    doc.text(`Total Paid : ₹${fee.paidAmount}`);

    doc.moveDown();

    doc.text(`Payment Mode : ${fee.paymentMode}`);

    doc.text(`Received By : ${fee.receivedBy}`);

    doc.end();

    stream.on("finish", () => {
      resolve(filePath);
    });

    stream.on("error", reject);
  });
};

export default generateReceipt;