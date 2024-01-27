import mongoose from 'mongoose'
import { createJWT,hashPassword } from './auth.js'
import { Team } from '../models/verifyTeam.js'

export const createTeam = async (req, res) => {
    const {name,collegeName,designation,dept,areaOfExpertise,email,password,phone,experience} = req.body
    console.log(`name:${name} & email:${email} & password:${password}  `)
    try {
        const hashedPassword = await hashPassword(password)
        const team = await Team.create({
        name,
        collegeName,
        designation,
        dept,
        areaOfExpertise,
        email,
        password: hashedPassword,
        phone,
        experience
        })
        const token = createJWT(team)
        res.cookie('token', token, { httpOnly: true })
        res.render('ps')
    } catch (e) {
        console.error(e)
        res.render('user')
    }
}


