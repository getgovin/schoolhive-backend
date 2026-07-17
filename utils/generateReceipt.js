import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const generateReceipt = async (fee) => {
  const receiptFolder = path.join("uploads", "receipts");

  if (!fs.existsSync(receiptFolder)) {
    fs.mkdirSync(receiptFolder, { recursive: true });
  }

  const outputPath = path.join(
    receiptFolder,
    `${fee.receiptNo}.pdf`
  );

  // Read HTML template
  let html = fs.readFileSync(
    path.join("templates", "receipt.html"),
    "utf8"
  );

  // Format date
  const receiptDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Format currency
  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN");

  // Replace placeholders
  const placeholders = {
    schoolName: "SchoolHive",
    receiptNo: fee.receiptNo,
    receiptDate,

    studentName: fee.studentName || "",
    fatherName: fee.fatherName || "",
    className: fee.className || "",
    sectionName: fee.sectionName || "",

    tuitionFee: formatAmount(fee.tuitionFee),
    busFee: formatAmount(fee.busFee),
    otherCharge: formatAmount(fee.otherCharge),
    fine: formatAmount(fee.fine),
    discount: formatAmount(fee.discount),
    paidAmount: formatAmount(fee.paidAmount),

    paymentMode: fee.paymentMode || "",
    receivedBy: fee.receivedBy || "",
  };

  Object.entries(placeholders).forEach(([key, value]) => {
    html = html.replace(
      new RegExp(`{{${key}}}`, "g"),
      value
    );
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: "networkidle0",
  });

  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      right: "20px",
      bottom: "20px",
      left: "20px",
    },
  });

  await browser.close();

  return outputPath;
};

export default generateReceipt;