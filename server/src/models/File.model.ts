import mongoose, { Schema } from "mongoose";

const FileSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  label: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ["doc", "folder"],
    required: true,
  },
  parentId: {
    type: String,
    required: false,
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
  ],
  FileContent: {
    type: String,
    required: false,
  },
  roomId: {
    type: String,
    required: true,
  },
});

export const File = mongoose.model("File", FileSchema);
