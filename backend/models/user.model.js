import mongoose from "mongoose";
import validator from "validator";
import Jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
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
    }
}, {timestamps: true})


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
userSchema.methods.generateAccessToken = function () {
    return Jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
        )
}

userSchema.methods.generateRefreshToken = function () {
    return Jwt.sign(
        {
            _id: this._id,
           

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
        )
}

export const User = mongoose.model("User", userSchema)