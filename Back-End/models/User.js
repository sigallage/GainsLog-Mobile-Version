import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  profilePic: { type: String },
  lastLogin: { type: Date }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);