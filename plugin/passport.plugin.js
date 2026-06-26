import bcrypt from "bcrypt";

const passwordPlugin = (schema) => {

  // Hash password before save
  schema.pre("save", async function (next) {
    try {
      if (!this.isModified("password")) {
        return next();
      }

      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);

    } catch (error) {
      next(error);
    }
  });

  // Compare password
  schema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

};

export default passwordPlugin;