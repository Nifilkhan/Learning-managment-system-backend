import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import { otpValidationSchema, signinSchema, signupSchema } from "../validations/validation.js";
import { generateOTP } from "../utils/otp.js";
import transport from "../middleware/sendMail.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';


dotenv.config();



//signup function(User registration)

export const signup = async(req,res) => {
    const {firstName,lastName,email,phone,password}= req.body;
    try{
        const {error} = signupSchema.validate(req.body);
        if(error) {
            return res.status(400).json({message:error.details[0].message})
        }

        const existingUser = await User.findOne({ email })

        if(existingUser){
            return res.status(401).json({message:'Email already exists'})
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            firstName,lastName,email,phone,password:hashedPassword
        })

        await newUser.save();

        const {otp,expirationTime} = generateOTP();
        newUser.verificationCode = otp;
        newUser.otpExpiration = expirationTime;

        console.log(otp);
       await transport.sendMail({
            from:process.env.OTP_SENDING_EMAIL,
            to:newUser.email,
            subject:'Verification code',
            html:`<h1>Verification Code ${otp}</h1>`
        })
        await newUser.save();
        res.status(201).json({message: "Signup completed, Verify the otp",newUser});
    }catch(err) {
        console.log(err)
    }
}


//otp validation function(User registration successfully verifies after the otp is verified succesfully)

export const verifyOtp = async(req,res) => {
    const {otp} = req.body;
    try {
        const {error} = otpValidationSchema.validate(req.body);
        if(error) {
            return res.status(400).json({message:error.details[0].message})
        }
        const user = await User.findOne({verificationCode:otp});

        if(!user) {
            return res.status(404).json({message:'Invalid otp'})
        }

        if(Date.now() > user.otpExpiration) {
            return res.json({message:'Otp is expired'})
        }

        user.verified = true;
        user.verificationCode = undefined;
        await user.save();
        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.log(error)
    }
}


//signin function(User Login using email and password)

export const signin = async(req,res) => {
    const {email,password}  = req.body;
    try {
        const {error} = signinSchema.validate(req.body)
        if(error) {
            return res.status(401).json({message:'Invalid credentials'})        
        }

        if(email === process.env.STATIC_ADMIN_EMAIL && password === process.env.STATIC_ADMIN_PASSWORD) {
            // console.log(email);
            // console.log(password);
            res.cookie('adminLoggedIn', true, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Secure cookie in production
                maxAge: 4 * 60 * 60 * 1000, // 4 hours expiration
                sameSite: 'Strict',
            });
            return res.status(200).json({role:'admin',message:'Admin logged in succesfully'})
        }
    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return res.status(404).json({message:'User not found'})
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(401).json({message:'Invalid password'})
    }

    //jwt creation
    const token = jwt.sign(
        {
            userId:user._id,
            role:user.roles
        },
        process.env.JWT_SECRET,
        {
            expiresIn:'4h'
        }
    )
    console.log(token)

    //storing jwt in cookie storage and it expires in 4hr
    res.cookie('Authorization',token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production', // Only send the cookie over HTTPS in production
        maxAge: 4 * 60 * 60 * 1000,
        sameSite: 'Strict', // Restricts the cookie to same-site requests (prevents CSRF attacks)
    })
        res.status(200).json({message:'User loggedin succesfully',role:user.roles})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const GetAllUsers = async(req,res) => {
    try {
        const VerifiedUsers = await User.find()
        res.status(200).json({message:'All verified users found ' , VerifiedUsers})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}

export const resendOtp = async(req,res) => {
    try {


        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error occured'})
    }
}

export default {signup,verifyOtp,signin,GetAllUsers}