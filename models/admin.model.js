import mongoose from "mongoose";

export const adminSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    roles:{type:String, enum:['student','admin'],default:'admin'}
},{timestamps:true})

const Admin = mongoose.model('Admin',adminSchema);
export default Admin;