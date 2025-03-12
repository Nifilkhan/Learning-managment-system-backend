import mongoose from "mongoose";


export const userScehma = mongoose.Schema({
    firstName:{type:String,required:true,minLength:[2],maxLength:[20]},
    lastName:{type:String,required:true,minLength:[2],maxLength:[20]},
    email:{type:String,required:true,unique:true,trim:true,lowercase:true},
    phone:{type:String,required:false,minLength:[10],maxLength:[15]},
    password:{type:String,required:false,trim:true,select:false},
    googleId:{type:String,required:false},
    verified: { type: Boolean, default: false },
    verificationCode: { type: Number ,select:false},
    otpExpiration:{type:Date},
    role:{type:String, enum:['student','admin'],default:'student'},
    purchasedCourses:[{type:mongoose.Schema.Types.ObjectId,ref:'Purchase'}]
}, {timestamps:true})

const User = mongoose.model('User',userScehma);
export default User;