import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true }, // Added full name
  username: { type: String, required: true, unique: true }, // Added username
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  workouts: [{ name: String, exercises: [String] }],
});

const User = mongoose.model("User", UserSchema);
export default User;
