import mongoose from 'mongoose'
import { Student } from '../models/student.js'
import { Industry } from '../models/industry.js'
import { Team } from '../models/verifyTeam.js'
import { comparePasswords, hashPassword, protect, createJWT } from './auth.js'

export const verifyStudent = async (req, res) => {
    const { email, password, userType } = req.body
    console.log(`email:${email} & password:${password} & userType:${userType}`)
    
    try {
        let user;
        // Check user type and query appropriate model
        switch(userType) {
            case 'seeker':
                user = await Student.findOne({ email });
                break;
            case 'industry':
                user = await Industry.findOne({ email });
                break;
            case 'verify':
                user = await Team.findOne({ email });
                break;
            default:
                return res.render('authentication', {
                    loginError: 'Invalid user type',
                    registerError: undefined
                });
        }
        
        if (!user) {
            return res.render('authentication', {
                loginError: 'Invalid email address',
                registerError: undefined
            })
        }

        const isValid = await comparePasswords(password, user.password)
        
        if (!isValid) {
            return res.render('authentication', {
                loginError: 'Invalid password',
                registerError: undefined
            })
        }

        const token = createJWT(user)
        res.cookie('token', token, { 
            httpOnly: true, 
            maxAge: 7000000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
        res.redirect('/dashboard')

    } catch (err) {
        console.error(err)
        res.render('authentication', {
            loginError: 'An error occurred during signin. Please try again.',
            registerError: undefined
        })
    }
}