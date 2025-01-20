import mongoose from "mongoose";

const EmailTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    text: { type: String, required: true },
    styles: {                            
      color: { type: String, default: "#000000" },
      fontSize: { type: String, default: "16px" }, 
      alignment: { type: String, default: "left" }, 
    },
  },
  footer: {
    text: { type: String, default: "" }, 
    styles: {                            
      color: { type: String, default: "#666666" }, 
      fontSize: { type: String, default: "12px" }, 
      alignment: { type: String, default: "center" },
    },
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UploadedImage",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

export const EmailTemplate = mongoose.model("EmailTemplate", EmailTemplateSchema);