import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import { otpValidationSchema, signinSchema, signupSchema } from "../validations/validation.js";
import { generateOTP } from "../utils/otp.js";
import transport from "../middleware/send.mail.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { getUserCount, getVerifiedUsers } from "../services/userCount.service.js";
import Admin from "../models/admin.model.js";


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

       await transport.sendMail({
            from:process.env.OTP_SENDING_EMAIL,
            to:newUser.email,
            subject:'Verification code',
            html:`<h1>Verification Code ${otp}</h1>`
        })
        await newUser.save();
        res.status(201).json({message: "Signup completed, Verify the otp",newUser});
    }catch(err) {
        throw new Error('Internal server error')    }
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
        throw new Error('Internal server error')
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

        const admin = await Admin.findOne({email})
        if(admin) {
            const isPasswordValide = await bcrypt.compare(password,admin.password);

            if(!isPasswordValide) {
                return res.status(402).json({message:'password is invalid'})
            }

            const adminToken = jwt.sign(
                {
                    role: 'admin', // Add any additional payload data as needed
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '4h', // Set token expiration
                }
            );
            console.log('Admin token',adminToken)
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
            role:user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:'1h'
        }
    )

    //storing jwt in cookie storage and it expires in 4hr
   return res.cookie('Authorization',token,{
        httpOnly:true,
        secure: true, // Only send the cookie over HTTPS in production
        // maxAge: 4 * 60 * 60 * 1000,
        sameSite: 'Lax', // Restricts the cookie to same-site requests (prevents CSRF attacks)
    }).status(200).json({message:'User loggedin succesfully',user:user})

    console.log('generated token',token)
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const logout = async(req,res) => {
    try {
        res.clearCookie('Authorization',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'strict'
        })

        res.clearCookie('adminLoggedIn',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'strict'
        })

        return res.status(200).json({message:'logged out succesfully'})
        
    } catch (error) {
        res.status(500).json({message:'Error occured during logout'})
    }
}

export const GetAllUsers = async(req,res) => {
    try {
        const VerifiedUsers = await getUserCount();
        const users = await getVerifiedUsers();
        
        res.status(200).json({message:'All verified users found ' , totalCount:VerifiedUsers,users:users})
    } catch (error) {
        res.status(500).json({message:'Internal server error'})
    }
}

export const getUser = async(req,res) => {
    try {
       
        console.log(req.userId)
        const user = await User.findById(req.userId).select("-password");

        console.log('user from the controller verified',user)


        if (!user) {
            return res.status(404).json({ message: "User not found" });
          }

          res.status(200).json({user})
    } catch (error) {
        res.status(500).json({message:'Internal error occured in get user'})
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