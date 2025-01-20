import mongoose from "mongoose";

const UploadedImageSchema = new mongoose.Schema({
  url: { type: String, required: true }, 
  associatedTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmailTemplate",
  },
  uploadedAt: { type: Date, default: Date.now }
}, { versionKey: false });

export const UploadedImage = mongoose.model("UploadedImage", UploadedImageSchema);