import mongoose from "mongoose";

interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
}

interface OrderItem {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: mongoose.Types.ObjectId;
}

export interface OrderDocument extends Document {
  shippingInfo: ShippingInfo;
  user: {
    _id:string,
    name:string
  };
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: "Processing" | "Shipped" | "Delivered";
  orderItems: OrderItem[];
  createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new mongoose.Schema<OrderDocument>(
  {
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      pinCode: {
        type: Number,
        required: true,
      },
    },

    user: {
     _id:{
      type:String
     },
     name:{
      type:String
     },
    },

    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    shippingCharges: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered"],
      default: "Processing",
    },

    orderItems: [
      {
        name: String,
        photo: String,
        price: Number,
        quantity: Number,
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<OrderDocument>("Order", orderSchema);