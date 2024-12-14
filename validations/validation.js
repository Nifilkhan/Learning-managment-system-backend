import Joi from "joi";

export const signupSchema = Joi.object({
    firstName:Joi.string().required().min(2).max(20),
    lastName:Joi.string().required().min(2).max(20),
    email: Joi.string().min(6).max(60).required().email(),
    phone: Joi.string().min(10).max(15).required(),
    password: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$')),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords must match'
      })
})

export const otpValidationSchema = Joi.object({
    otp:Joi.number().required()
})

export const signinSchema = Joi.object({
    email: Joi.string().min(6).max(60).required().email(),
    password: Joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
  });

export default {signupSchema,otpValidationSchema,signinSchema}