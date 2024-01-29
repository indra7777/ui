import { createJWT,hashPassword } from "./auth.js"

import { Industry } from "../models/industry.js"

export const createIndustry =  async (req,res)=>{
    const {name,industryName,employeeID,siteLink,email,password,officialNumber,personalNumber} = req.body
    console.log(`name:${name} & email:${email} & password:${password} & phone:${officialNumber} & phone:${personalNumber}  & siteLink:${siteLink}
    & role:${role} & employeeID:${employeeID} `)

    if(!name | !industryName | !employeeID | !siteLink | !email | !password | !officialNumber | !personalNumber){
        res.send('invalid input')
        return
    }
    const Role = "Industry"
    
    const hashedPassword = await hashPassword(password)

    const industry = new Industry({
        name:name,
        industryName:industryName,
        employeeID:employeeID,
        role:Role,
        siteLink:siteLink,
        email:email,
        password:hashedPassword,
        officialNumber:officialNumber,
        personalNumber:personalNumber
    })

    industry.save()
        .then(() => {
            console.log(industry);
            res.render('ps');
        })
        .catch((err) => {
            console.log(err);
        })

}