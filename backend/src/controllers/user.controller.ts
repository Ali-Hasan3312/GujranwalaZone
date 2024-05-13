import { NextFunction,Request,Response } from "express";
import { User } from "../models/user.model.js";
import { NewUserRequestBody } from "../types/types.js";

export const newUser = async (req:Request <{},{},NewUserRequestBody>,res:Response,next:NextFunction)=>{
 try {
     const  { name, email, gender, photo, _id } = req.body;

     const user = await User.create({
        name,
        email,
        gender,
        photo,
        dob: new Date(),
        _id
     })
  return   res.status(201).json({
        success: true,
        message: `Welcome, ${user.name}`
     })
 } catch (error) {
    console.log(error);
    
    
 }


}

