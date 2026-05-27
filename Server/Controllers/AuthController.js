import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import crypto from 'bcryptjs'
import 'dotenv/config'
import User from '../Models/userModel.js'

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};
 
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });
};

const sendOTPEmail = async (email, otp, userName) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },  
  });
 
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Email Verification OTP',
    html: `
      <h2>Welcome ${userName}!</h2>
      <p>Your OTP for email verification is:</p>
      <h1 style="color: #007bff; letter-spacing: 5px;">${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
      <p>Do not share this OTP with anyone.</p>
    `,
  };
 
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send OTP email');
  }
};

const register = async() => {

}