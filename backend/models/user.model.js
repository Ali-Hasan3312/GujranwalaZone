import mongoose from "mongoose";
import validator from "validator";
import Jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { type } from "os";
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        
        trim: true,
    },
    userName: {
        type: String,
       
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validator: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        

    },
    Avatar: {
       type: String,
       required: true
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    
      resetPasswordToken: String,
      resetPasswordExpire: Date, });


userSchema.pre("save", async function (next){
    if(!this.isModified("password")) {
        next();
    } 
    this.password = await bcrypt.hash(this.password,10)
    next()

});
userSchema.methods.isPasswordCorrect  = async function (password){
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.getJWTToken = function () {
    return Jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };

  userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };

export const User = mongoose.model("User", userSchema)