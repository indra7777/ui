// name,collegeName,registrationNumber,stream,branch,email,password,phone,currentYear,passedOutYear

import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
    name: String,
    collegeName: String,
    stream: String,
    role:String,
    branch: String,
    email: String,
    password: String,
    phone: String,
    currentYear: Number,
    passedOutYear: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    image: {
    type: String,
    required: false,
  }
});

export const Student = mongoose.model('Student',studentSchema)