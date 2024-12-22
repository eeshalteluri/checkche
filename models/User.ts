import mongoose, { Schema, Document } from "mongoose";
import UserType from "@/types/user";

const UserSchema = new mongoose.Schema<UserType>({
  name: { type: String, required: true }, // Name is required
  email: { type: String, required: true, unique: true }, // Email is required and must be unique
  image: { type: String, default: null }, // Default value for optional fields
  emailverified: { type: Boolean, default: null }, // Allows null values
  username: { type: String, unique: true}, 
  friends: { type: [String], default: [] }, // Array of strings with default empty array
  groups: { type: [String], default: [] } // Array of strings with default empty array
});

// Export the model
const User = mongoose.model<UserType>("User", UserSchema);
export default User;