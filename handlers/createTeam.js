import mongoose from 'mongoose'
import { createJWT,hashPassword } from './auth.js'
import { Team } from '../models/verifyTeam.js'

export const createTeam = async (req, res) => {
    const {email,password,phone} = req.body
    console.log(`email:${email} & password:${password}  `)
     const Role = "Verify-Team"
    try {
        const hashedPassword = await hashPassword(password)
        const team = await Team.create({
        email,
        password: hashedPassword,
        phone,
        })
        const token = createJWT(team)
        res.cookie('token', token, { httpOnly: true })
        res.render('/ps')
    } catch (e) {
        console.error(e)
        res.render('/user')
    }
}


