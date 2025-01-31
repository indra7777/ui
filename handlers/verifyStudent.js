import mongoose from 'mongoose'
import { Student } from '../models/student.js'
import { comparePasswords, hashPassword, protect, createJWT } from './auth.js'

export const verifyStudent = async (req, res) => {
    const { email, password } = req.body
    console.log(`email:${email} & password:${password}`)
    
    try {
        const student = await Student.findOne({ email: email })
        
        if (!student) {
            return res.render('authentication', {
                loginError: 'Invalid email address',
                registerError: undefined
            })
        }

        const isValid = await comparePasswords(password, student.password)
        
        if (!isValid) {
            return res.render('authentication', {
                loginError: 'Invalid password',
                registerError: undefined
            })
        }

        const token = createJWT(student)
        res.cookie('token', token, { httpOnly: true, maxAge: 7000000 }) // set token as a cookie
        res.redirect('/dashboard')

    } catch (err) {
        console.error(err)
        res.render('authentication', {
            loginError: 'An error occurred during signin. Please try again.',
            registerError: undefined
        })
    }
}