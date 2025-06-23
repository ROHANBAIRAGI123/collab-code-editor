import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkUserId: { type: String, unique: true, required: true },
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  authProvider: {
    type: String,
    enum: ["credentials", "google", "clerk"],
    default: "credentials",
  },
});

export const User = mongoose.model("User", userSchema);
