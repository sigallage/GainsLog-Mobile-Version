const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true }, // Auth0 user ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePic: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
