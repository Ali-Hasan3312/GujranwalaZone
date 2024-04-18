import { timeStamp } from "console";
import { url } from "inspector";
import mongoose from "mongoose";
import { type } from "os";

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter product description"],
        
    },
    product: {
        type: Number,
        required: [true, "Please enter product price"],
        maxLength: [8, "Price cannot exceed 8 characters"]
    },
    rating: {
        type: Number,
        default: 0
    },
    images: [
        {
        public_id: {
            type: String,
            required: true
        },
        url : {
            type: String,
            required: true
        }
    }
],
category: {
    type: String,
    required: [true, "Please enter product category"]

},
stock: {
    type: Number, 
    required: [true, "Please enter product stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1
},
numOfReviews: {
    type: Number,
    default: 0
},

reviews: [
   { 
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
}
]
}, {timestamps: true})

export const Product = mongoose.model("Product", productSchema) 