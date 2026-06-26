import mongoose from "mongoose";
import bcrypt from "bcrypt";
import passwordPlugin from "../plugin/passport.plugin.js";


const superadminSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

// Apply plugin
superadminSchema.plugin(passwordPlugin);




const SuperAdmin = mongoose.model("Superadmin", superadminSchema);

export { SuperAdmin };
