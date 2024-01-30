import express from 'express'
const router = express.Router();
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Student } from '../models/student.js';
import nodemailer from 'nodemailer'

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'gmail', // replace with your email provider
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await Student.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

  // send the recovery link to the user's email
  const link = process.env.BASE_URL+"/reset-password/"+token;
  const mailOptions = {
    to: email,
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n${link}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
  };

  transporter.sendMail(mailOptions, function(err) {
    if (err) {
      console.error('There was an error: ', err);
      return res.status(500).json({ message: 'Error sending email' });
    }
    return res.status(200).json({ message: 'Email sent with password reset instructions' });
  });
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {

    const decoded = jwt.verify(token, process.env.SECRET_KEY);


    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router