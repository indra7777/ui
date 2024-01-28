import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "No title specified."]
  },
  content: {
    type: String,
    required: [true, "No content specified."]
  },
    image: {
    type: String,
    required: false,
  },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Post = mongoose.model('Post', postSchema);