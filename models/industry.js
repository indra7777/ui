//name,industryName,employeeID,role,siteLink,email,password,officialNumber,personalNumber

import mongoose from 'mongoose'

const industrySchema = mongoose.Schema({
    name: String,
    industryName: String,
    role:String,
    employeeID: String,
    role: String,
    siteLink: String,
    email: String,
    password: String,
    officialNumber: Number,
    personalNumber: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
})
export const Industry = mongoose.model('Industry',industrySchema)