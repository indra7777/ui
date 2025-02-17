import { createJWT,hashPassword } from "./auth.js"

import { Industry } from "../models/industry.js"

export const createIndustry =  async (req,res)=>{
    const {email,password,phone} = req.body
    console.log(` & email:${email} & password:${password} & phone:${phone} `)

    if( !email | !password | !personalNumber){
        res.send('invalid input')
        return
    }
    const Role = "Industry";

    const existingUser= await Industry.findOne({
        email:email
    });
    if(existingUser){
        return res.render('user', {
            registerError: 'Email already registered',
            loginError: undefined,
            successMessage: undefined,
            isSignup: true
        });
    }
    
    const hashedPassword = await hashPassword(password)

    const industry = new Industry({
        email:email,
        password:hashedPassword,
        personalNumber:phone
    });

    await industry.save();
    const token=createJWT(industry);
    res.cookie('token', token, { httpOnly: true }); // set 
    res.redirect('/dashboard');
}