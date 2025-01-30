import { Student } from '../models/student.js'
import { Industry } from '../models/industry.js'
import { Team } from '../models/verifyTeam.js'
import { hashPassword } from './auth.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'uncalledinnovators@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

// Get the appropriate model based on user type
const getUserModel = (userType) => {
    switch(userType) {
        case 'student':
            return Student;
        case 'industry':
            return Industry;
        case 'verify':
            return Team;
        default:
            return null;
    }
}

export const renderForgotPassword = (req, res) => {
    res.render('forgotPassword', {
        error: null,
        success: null
    });
}

export const handleForgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await Student.findOne({ email });
        
        if (!user) {
            return res.render('forgotPassword', {
                error: 'No account found with this email',
                success: null
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;

        const mailOptions = {
            from: 'uncalledinnovators@gmail.com',
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset Request</h1>
                <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
                <a href="${resetLink}">Reset Password</a>
            `
        };

        await transporter.sendMail(mailOptions);

        res.render('forgotPassword', {
            error: null,
            success: 'Password reset link has been sent to your email'
        });

    } catch (error) {
        console.error('Password reset error:', error);
        res.render('forgotPassword', {
            error: 'An error occurred. Please try again.',
            success: null
        });
    }
}

export const handleResetPassword = async (req, res) => {
    const { token, password } = req.body;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Student.findById(decoded.id);
        
        if (!user) {
            return res.render('resetPassword', {
                error: 'Invalid or expired reset link',
                success: null,
                token
            });
        }

        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        await user.save();

        res.render('resetPassword', {
            error: null,
            success: 'Password has been reset successfully. You can now login with your new password.',
            token
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.render('resetPassword', {
            error: 'Invalid or expired reset link',
            success: null,
            token
        });
    }
} 