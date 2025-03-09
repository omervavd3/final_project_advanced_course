import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImageUrl: {
    type: String,
    required: true,
  },
  tokens: {
    type: [String],
    required: true,
  }
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;