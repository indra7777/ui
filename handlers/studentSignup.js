import { comparePasswords,hashPassword,protect,createJWT } from './auth.js'
import { Student } from '../models/student.js'

export const createStudent =  async (req,res)=>{
    const {avatar , name,collegeName,stream,branch,email,password,phone,currentYear,passedOutYear} = req.body
    // console.log(req.body)
    console.log(`name:${name} & email:${email} & password:${password} & phone:${phone}  & branch:${branch}
    & stream:${stream} & collegeName:${collegeName} `)

    if(!name | !collegeName | !stream | !branch | !email | !password | !phone | !currentYear | !passedOutYear){
        res.send('invalid input')
        return
    }
    const hashedPassword = await hashPassword(password)
     const Role = "Student"
    const student = new Student({
        name:name,
        collegeName:collegeName,
        stream:stream,
        branch:branch,
        email:email,
        role:Role,
        password:hashedPassword,
        phone:phone,
        currentYear:currentYear,
        passedOutYear:passedOutYear,
        image:avatar, 
    })

    student.save()
        .then(() => {
           const token = createJWT(student)
                    res.cookie('token', token, { httpOnly: true,maxAge:7000000 }); // set token as a cookie
                    res.render('dashboard',{
                user:student
        })
    })
        .catch((err) => {
            console.log(err);
        })
    }






// export const verifyStudent  = (req,res)=>{
//     const {email,password} = req.body
//     console.log(`email:${email} & password:${password}`)
//     Student.findOne({email:email})
//         .then((student)=>{
//             if(!student){
//                 res.send('invalid email')
//                 return
//             }
//             comparePasswords(password,student.password)
//                 .then((result)=>{
//                     if(!result){
//                         res.send('invalid password')
//                         return
//                     }
//                     const token = createJWT(student)
//                     res.json({token})
//                 })
//                 .catch((err)=>{
//                     console.log(err)
//                 })
//         })
//         .catch((err)=>{
//             console.log(err)
//         })
// }