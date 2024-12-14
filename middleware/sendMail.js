import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config();

const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.OTP_SENDING_EMAIL,
        pass: process.env.OTP_SENDING_EMAIL_PASSWORD,
    },
    logger:true,
})

export default transport