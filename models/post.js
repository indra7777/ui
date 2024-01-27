import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "No title specified."]
  },
  content: {
    type: String,
    required: [true, "No content specified."]
  }
});

export const Post = mongoose.model('Post', postSchema);