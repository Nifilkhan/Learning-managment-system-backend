import connectDb from "../config/db.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import mongoose from "mongoose";
import admin from "../models/admin.model.js";

const adminCredentials = {
    name:'Nifil',
    email:'nifilkhanss5151@gmail.com',
    password:'SabeeR123',
    roles:'admin'
}


const seedAdmin = async() => {
    try {
        await connectDb();
        const seedAdminEmail = await admin.findOne({email:adminCredentials.email});
        if(seedAdminEmail) {
            console.log('email already exists as admin')
        } else{
            const hashedPassword = await bcrypt.hash(adminCredentials.password,10);
            adminCredentials.password = hashedPassword;
            const newAdmin = await admin(adminCredentials);
            await newAdmin.save();
            console.log("Admin data seeded successfully to the user collection!");
        }
        mongoose.connection.close();
     }  
    catch (error) {
        console.log(error,'error occured while seeding the data');
        mongoose.Connection.close();        
    }
}

seedAdmin();