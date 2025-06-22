import mongoose from "mongoose";

const codeExecutionSchema = new mongoose.Schema({
  clerkUserId: { type: String, unique: true, required: true },

  name: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  currentCodeContent: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
  error: {
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
