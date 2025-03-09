import mongoose from "mongoose";

export type IComment = {
    comment: string;
    postId: string;
    owner: string;
    _id?: string;
}

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    postId: {
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
    date: {
        type: Date,
        default: Date.now,
    }
})

const CommentModel = mongoose.model("Comments", commentSchema);

export default CommentModel;