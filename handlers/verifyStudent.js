import mongoose from 'mongoose'
import { Student } from '../models/student.js'
import { comparePasswords,hashPassword,protect,createJWT } from './auth.js'


export const verifyStudent  = async (req,res)=>{
    const {email,password} = req.body
    console.log(`email:${email} & password:${password}`)
    await Student.findOne({email:email})
        .then((student)=>{
            if(!student){
                res.send('invalid email')
                return
            }
             comparePasswords(password,student.password)
                .then((result)=>{
                    if(!result){
                        res.send('invalid password')
                        return
                    }
                    const token = createJWT(student)
                    res.cookie('token', token, { httpOnly: true }); // set token as a cookie
                    res.render('ps');

                })
                .catch((err)=>{
                    console.log(err)
                })
        })
        .catch((err)=>{
            console.log(err)
        })
}