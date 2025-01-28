import { Student } from '../models/student.js'
import { Industry } from '../models/industry.js'
import { Team } from '../models/verifyTeam.js'
import { hashPassword } from './auth.js'

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
    res.render('forgotPassword', { error: undefined });
}

export const handleForgotPassword = async (req, res) => {
    const { email, userType } = req.body;

    try {
        const Model = getUserModel(userType);
        if (!Model) {
            return res.render('forgotPassword', { error: 'Invalid user type' });
        }

        const user = await Model.findOne({ email });
        if (!user) {
            return res.render('forgotPassword', { error: 'No account found with this email' });
        }

        // If user exists, render reset password page
        res.render('resetPassword', { 
            email,
            userType,
            error: undefined 
        });

    } catch (err) {
        console.error(err);
        res.render('forgotPassword', { error: 'An error occurred. Please try again.' });
    }
}

export const handleResetPassword = async (req, res) => {
    const { email, userType, newPassword, confirmPassword } = req.body;

    try {
        // Validate passwords match
        if (newPassword !== confirmPassword) {
            return res.render('resetPassword', { 
                email,
                userType,
                error: 'Passwords do not match' 
            });
        }

        const Model = getUserModel(userType);
        if (!Model) {
            return res.render('resetPassword', { 
                email,
                userType,
                error: 'Invalid user type' 
            });
        }

        const user = await Model.findOne({ email });
        if (!user) {
            return res.render('resetPassword', { 
                email,
                userType,
                error: 'User not found' 
            });
        }

        // Update password
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        // Redirect to login with success message
        res.render('user', { 
            loginError: undefined,
            registerError: undefined,
            successMessage: 'Password has been reset successfully. Please login with your new password.'
        });

    } catch (err) {
        console.error(err);
        res.render('resetPassword', { 
            email,
            userType,
            error: 'An error occurred while resetting password. Please try again.' 
        });
    }
} 