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
    res.render('forgotPassword', {
        error: null,
        success: null
    });
}

export const handleForgotPassword = async (req, res) => {
    const { email, userType, newPassword, confirmPassword } = req.body;
    
    try {
        // Validate password match
        if (newPassword !== confirmPassword) {
            return res.render('forgotPassword', {
                error: 'Passwords do not match',
                success: null
            });
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.render('forgotPassword', {
                error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
                success: null
            });
        }

        const Model = getUserModel(userType);
        if (!Model) {
            return res.render('forgotPassword', {
                error: 'Invalid user type',
                success: null
            });
        }
        
        const user = await Model.findOne({ email });
        if (!user) {
            return res.render('forgotPassword', {
                error: 'No account found with this email',
                success: null
            });
        }

        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        // Log the password reset for security
        console.log(`Password reset successful for user ${user.email} (${userType})`);

        res.render('forgotPassword', {
            error: null,
            success: 'Password has been reset successfully. You can now login with your new password.'
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
    const { token, password, confirmPassword } = req.body;
    
    try {
        // Validate password match
        if (password !== confirmPassword) {
            return res.render('resetPassword', {
                error: 'Passwords do not match',
                success: null,
                token
            });
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.render('resetPassword', {
                error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
                success: null,
                token
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const Model = getUserModel(decoded.userType);
        
        if (!Model) {
            return res.render('resetPassword', {
                error: 'Invalid user type',
                success: null,
                token
            });
        }

        const user = await Model.findById(decoded.id);
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

        // Log the password reset for security
        console.log(`Password reset successful for user ${user.email} (${decoded.userType})`);

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