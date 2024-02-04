import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    industrialist: {
        type: String,
        required: true
    }
});

export const Problem = mongoose.model('Problem', problemSchema);
