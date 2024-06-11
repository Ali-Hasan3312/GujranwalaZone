import mongoose from "mongoose";
interface IProduct extends Document {
  _id:string;
  name: string;
  photo: string;
  price: Number;
  stock: Number;
  category: String;
  createdAt: Date;
  updatedAt: Date;
 
}

const productSchema = new mongoose.Schema(
  {
   
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    photo: {
      type: String,
      required: [true, "Please enter Photo"],
    },
    price: {
      type: Number,
      required: [true, "Please enter Price"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter Stock"],
    },
    category: {
      type: String,
      required: [true, "Please enter Category"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);