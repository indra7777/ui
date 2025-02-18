//name,industryName,employeeID,role,siteLink,email,password,officialNumber,personalNumber

import mongoose from 'mongoose'

const industrySchema = mongoose.Schema({
    email: String,
    password: String,
    personalNumber: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
})
export const Industry = mongoose.model('Industry',industrySchema)