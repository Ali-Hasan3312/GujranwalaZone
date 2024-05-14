import mongoose from "mongoose";
import 'dotenv/config';
export const connectDB = ()=>{
    mongoose.connect(`${process.env.MONGODB_URL}`,{
        dbName: "Gujranwala_Zone"
    })
    .then((c)=> console.log(`MongoDB Connected to ${c.connection.host}`))
    .catch((e)=> console.log(e))
}