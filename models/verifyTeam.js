import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const Team = mongoose.model('Team', teamSchema)