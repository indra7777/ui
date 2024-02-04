import mongoose from 'mongoose'
import { comparePasswords,createJWT } from './auth.js'
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
        const token = createJWT(industry)
        res.cookie('token', token, { httpOnly: true }); // set token as a cookie
            res.render('ind',{
            user:industry
        }
    )}
    )
        .catch((err)=>{
            console.log(err)
        })
    
}
    )
        .catch((err)=>{
            console.log(err)
        })
    
}