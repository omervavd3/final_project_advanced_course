import mongoose from "mongoose";

export type ILikes = {
    userId: string;
    postId: string;
    _id?: string;
}

const likesSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const LikesModel = mongoose.model("Likes", likesSchema);
export default LikesModel;