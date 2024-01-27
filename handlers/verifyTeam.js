import mongoose from 'mongoose'
import { comparePasswords,createJWT } from './auth.js'
import { Team } from '../models/verifyTeam.js'

export const verifyTeam = async (req, res) => {
    try {
       
        const { email, password } = req.body
        const team = await Team.findOne({email: email})
        if (!team) {
            res.render('user')
            return
        }
        const passwordValid = await comparePasswords(password, team.password)
        if (!passwordValid) {
            res.send('invalid-password')
            return
        }
        const token = createJWT(team)
        res.cookie('token', token, { httpOnly: true })
        res.render('ps')
    }
    catch (e) {
        console.error(e)
        res.render('user')
    }
}