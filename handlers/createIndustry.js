import { createJWT, hashPassword } from "./auth.js"
import { Industry } from "../models/industry.js"

export const createIndustry = async (req, res) => {
    const { name, industryName, employeeID, siteLink, email, password, officialNumber, personalNumber } = req.body
    console.log(`name:${name} & email:${email} & password:${password} & phone:${officialNumber} & phone:${personalNumber} & siteLink:${siteLink} & employeeID:${employeeID}`)

    if (!name || !industryName || !employeeID || !siteLink || !email || !password || !officialNumber || !personalNumber) {
        return res.render('user', {
            registerError: 'All fields are required',
            loginError: undefined,
            successMessage: undefined,
            isSignup: true
        })
    }

    try {
        // Check if email already exists
        const existingIndustry = await Industry.findOne({ email: email })
        if (existingIndustry) {
            return res.render('user', {
                registerError: 'Email already registered',
                loginError: undefined,
                successMessage: undefined,
                isSignup: true
            })
        }

        const hashedPassword = await hashPassword(password)
        const Role = "Industry"

        const industry = new Industry({
            name: name,
            industryName: industryName,
            employeeID: employeeID,
            siteLink: siteLink,
            email: email,
            role: Role,
            password: hashedPassword,
            officialNumber: officialNumber,
            personalNumber: personalNumber
        })

        await industry.save()
        const token = createJWT(industry)
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7000000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
        res.redirect('/dashboard')

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