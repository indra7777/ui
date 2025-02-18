import mongoose from 'mongoose'
import { createJWT, hashPassword } from './auth.js'
import { Team } from '../models/verifyTeam.js'

export const createTeam = async (req, res) => {
    const { email, password, phone } = req.body
    console.log(`email:${email} & password:${password} & phone:${phone}`)

    if (!email || !password || !phone) {
        return res.render('user', {
            registerError: 'Email, password and phone number are required',
            loginError: undefined,
            successMessage: undefined,
            isSignup: true
        })
    }

    try {
        // Check if email already exists
        const existingTeam = await Team.findOne({ email: email })
        if (existingTeam) {
            return res.render('user', {
                registerError: 'Email already registered',
                loginError: undefined,
                successMessage: undefined,
                isSignup: true
            })
        }

        const hashedPassword = await hashPassword(password)
        const Role = "Verify-Team"

        const team = await Team.create({
            email,
            password: hashedPassword,
            phone,
            role: Role
        })

        const token = createJWT(team)
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7000000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
        res.redirect('/dashboard')

    } catch (err) {
        console.error(err)
        res.render('user', {
            registerError: 'An error occurred during registration. Please try again.',
            loginError: undefined,
            successMessage: undefined,
            isSignup: true
        })
    }
}


