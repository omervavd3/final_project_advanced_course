import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  ownerName:{
    type: String,
    required: true,
  },
  ownerPhoto: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const PostModel = mongoose.model("Post", postSchema);
export default PostModel;