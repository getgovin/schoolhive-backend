export const excelDateToJSDate = (value) => {
  if (!value) return null;

  // Already a JS Date
  if (value instanceof Date) {
    return value;
  }

  // Excel Serial Number
  if (typeof value === "number") {
    const utc_days = Math.floor(value - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate()
    );
  }

  // String Date
  if (typeof value === "string") {
    const date = value.trim();

    // yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return new Date(date);
    }

    // dd/mm/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const [day, month, year] = date.split("/");

      return new Date(year, month - 1, day);
    }

    // dd-mm-yyyy
    if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
      const [day, month, year] = date.split("-");

      return new Date(year, month - 1, day);
    }

    // Any other valid date string
    const parsed = new Date(date);

    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
};