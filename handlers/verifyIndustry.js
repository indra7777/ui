import mongoose from 'mongoose'
import { comparePasswords } from './auth.js'
import { Industry } from '../models/industry.js'

export const verifyIndustry  = async (req,res)=>{
    const {email,password} = req.body
    console.log(`email:${email} & password:${password}`)
    await Industry.findOne({email:email})
        .then((industry)=>{
            if(!industry){
                res.send('invalid email')
                return
            }
            comparePasswords(password,industry.password)
                .then((result)=>{
                    if(!result){
                        res.send('invalid password')
                        return
                    }
                    res.render('ind');
                })
                .catch((err)=>{
                    console.log(err)
                })
        })
        .catch((err)=>{
            console.log(err)
        })
}