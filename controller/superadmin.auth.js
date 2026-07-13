import { SuperAdmin } from "../models/superadmin.js";
import { generateToken } from "../utils/jwt.js";

 const superAdminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const superadminuser = await SuperAdmin.findOne({ email: email });
    if (!superadminuser) {
      return res
        .status(401)
        .json({ status: false, message: "Incorrect email and password" });
    }
    const isValidpassword = await superadminuser.comparePassword(password);

    if (!isValidpassword) {
      return res
        .status(401)
        .json({ status: false, message: "Incorrect password" });
    } else {
        const payload = {
            id : superAdminLogin.id
        }
        const token  = generateToken(payload)
        return res.status(200).json({status:true , message:" Login Successfully" , user:superadminuser , token:token})
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" , error:error.message });
  }
};


export {superAdminLogin};