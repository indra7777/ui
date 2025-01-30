import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'

dotenv.config()

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model('Contact', contactSchema);

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const contactUS = async (req, res) => {
    try {
        // Validate input
        if (!req.body.name || !req.body.email || !req.body.subject || !req.body.message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Create contact record
        const contact = new Contact({
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message
        });

        // Save to database
        await contact.save();

        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'uncalledinnovators@gmail.com',
            subject: `New Contact Form Submission: ${req.body.subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${req.body.name}</p>
                <p><strong>Email:</strong> ${req.body.email}</p>
                <p><strong>Subject:</strong> ${req.body.subject}</p>
                <p><strong>Message:</strong></p>
                <p>${req.body.message}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        // Send confirmation email to user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: req.body.email,
            subject: 'Thank you for contacting Uncalled Innovators',
            html: `
                <h3>Thank you for reaching out!</h3>
                <p>Dear ${req.body.name},</p>
                <p>We have received your message and will get back to you as soon as possible.</p>
                <p>Best regards,<br>Uncalled Innovators Team</p>
            `
        };

        await transporter.sendMail(userMailOptions);

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully!'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to send message. Please try again later.'
        });
    }
}
