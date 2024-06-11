import { NextFunction, Response,Request } from "express";

export interface NewUserRequestBody{
    name: string;
    dob:Date;
    email: string;
    photo: string;
    gender: string;
    _id: string;
    
}
export type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void | Response<any, Record<string, any>>>;
  export interface emailOptionsProps{
    email:string;
    subject:string;
    message:string;
  }
export interface newProductRequestBody{
  name:string;
  price:number;
  stock:number;
  category:string;
  photo:string;
}
export interface BaseQuery{
  name?: {
    $regex: string;
    $options: string;
  };
  price?: { $lte: number };
  category?: string;
}
export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};
export type InvalidateCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: string;
  orderId?: string;
  productId?: string | string[];
};
export type OrderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};

export type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};

export interface NewOrderRequestBody {
  shippingInfo: ShippingInfoType;
  user: {
    _id:string,
    name:string
  };
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: OrderItemType[];
}