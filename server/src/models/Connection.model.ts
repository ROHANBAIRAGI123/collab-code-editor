import mongoose from "mongoose";

const codeExecutionSchema = new mongoose.Schema({
  currentCodeContent: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
});

export const codeExecution = mongoose.model(
  "codeExecution",
  codeExecutionSchema
);
