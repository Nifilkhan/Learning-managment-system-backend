import mongoose  from "mongoose";
const connectDb = async() => {
    try{
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log('mongodb connected successfully ',connect.connection.host,connect.connection.port)
    } catch(err){
        console.log(err,'Error occured while connnecting mongodb');
        process.exit(1);
    }
} 



export default connectDb;