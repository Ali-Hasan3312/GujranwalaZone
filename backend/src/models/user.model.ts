import mongoose from "mongoose";
import validator from "validator";
import Jwt, { Secret } from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"
import 'dotenv/config'
export interface IUser extends Document{
    _id: string;
    name: string;
    photo?: string;
    email: string;
    password: string;
    gender: "male" | "female";
    resetPasswordToken?: string;
    resetPasswordExpire?: number;
    isPasswordCorrect(password: string): Promise<boolean>;
    getJWTToken(): string;
    getResetPasswordToken(): string;
    role: "admin" | "user";
    createdAt: Date;
    updatedAt: Date;
   
}
const userSchema = new mongoose.Schema({
  
    _id: {
        type: String,
        required: [true, "Please enter ID"]

    },
    name: {
        type: String,
        required: [true, "Please enter Name"]
    },
    email: {
        type: String,
        unique: [true, "Email already Exists"],
        required: [true, "Please enter Email"],
        validate: validator.default.isEmail
    },
    gender:{
        type: String,
        enum: ["male", "female"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
    },
    photo: {
        type: String,
        
    },
    role: {
        type: String,
       enum: ["admin", "user"],
       default: "user"
    },
   
   
    resetPasswordToken: String,
    resetPasswordExpire: Date,

},{
    timestamps: true
});


userSchema.pre("save", async function (next){
    if(!this.isModified("password")) {
        next();
    } 
    this.password = await bcrypt.hash(this.password,10)
    next()

});

userSchema.methods.isPasswordCorrect  = async function (password:string){
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.getJWTToken = function () {
    return Jwt.sign({ id: this._id },  process.env.JWT_SECRET as Secret,{
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


  export const User = mongoose.model<IUser>("User", userSchema)

