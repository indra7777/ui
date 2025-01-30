import { comparePasswords,hashPassword,protect,createJWT } from './auth.js'
import { Student } from '../models/student.js'

export const createStudent =  async (req,res)=>{
    const {avatar , name,collegeName,stream,branch,email,password,phone,currentYear,passedOutYear} = req.body
    // console.log(req.body)
    console.log(`name:${name} & email:${email} & password:${password} & phone:${phone}  & branch:${branch}
    & stream:${stream} & collegeName:${collegeName} `)

    if(!name | !collegeName | !stream | !branch | !email | !password | !phone | !currentYear | !passedOutYear){
        return res.render('user', {
            registerError: 'All fields are required',
            loginError: undefined,
            successMessage: undefined,
            isSignup: true
        })
    }

    try {
        // Check if email already exists
        const existingStudent = await Student.findOne({ email: email })
        if (existingStudent) {
            return res.render('user', {
                registerError: 'Email already registered',
                loginError: undefined,
                successMessage: undefined,
                isSignup: true
            })
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

        await student.save()
        const token = createJWT(student)
        res.cookie('token', token, { httpOnly: true,maxAge:7000000 }); // set token as a cookie
        res.redirect('/home')

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