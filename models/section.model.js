import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "classes", // Model name
    required: true,
  },
  sectionName: {
    type: String,
    required: true,
  },
});

const SectionCreation = mongoose.model("Sections", sectionSchema);

export { SectionCreation };
