import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    requried: "Text is required"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  user: {
    type: String,
    required: "userName is required"
  },
  avatarUrl: {
    type: String,
    required: "avatarUrl is required"
  }
});

const model = mongoose.model("Comment", CommentSchema);
export default model;
