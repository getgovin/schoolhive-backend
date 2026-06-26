import { SuperAdmin } from "../models/superadmin.js";

const superAdminCreate = async (req, res) => {
  try {
    const data = req.body;
    const newsuperadmin = new SuperAdmin(data);
    const response = await newsuperadmin.save();

    return res
      .status(201)
      .json({
        status: true,
        message: "Super Admin created successfully",
        data: response,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

export { superAdminCreate };
