import mongoose from "mongoose";


export const userScehma = mongoose.Schema({
    firstName:{type:String,required:true,minLength:[2],maxLength:[20]},
    lastName:{type:String,required:true,minLength:[2],maxLength:[20]},
    email:{type:String,required:true,unique:true,trim:true,lowercase:true},
    phone:{type:String,required:true,minLength:[10],maxLength:[15]},
    password:{type:String,required:true,trim:true,select:false},
    verified: { type: Boolean, default: false },
    verificationCode: { type: Number ,select:false},
    otpExpiration:{type:Date},
    roles:{type:String, enum:['student','admin'],default:'student'}
}, {timestamps:true})

const User = mongoose.model('User',userScehma);
export default User;