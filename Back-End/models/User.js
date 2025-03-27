const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  username: { type: String, required: true },
  profilePicture: { type: String }, // Store profile picture from Auth0
  isVerified: { type: Boolean, default: true }, // Auth0 already verifies emails
});

module.exports = mongoose.model("User", UserSchema);
