import type { Address, UserBriefDTO, UserDetailedDTO } from "../types/user";
import type { OrderStatus, PaymentMethod } from "../types/enums"; 
import type { ImageDTO } from "./image";

export interface OrderBriefDTO {
  orderId: string; 
  orderTrackingNumber: string;
  customerId: string; 
  total: number;
  items: number;
  deliveryDays: number; 
  deliveryDate: string; 
  orderStatus: OrderStatus;
  orderDateTime: string; 
}

export interface OrderDetail {
  merchantId: string; 
  productId: string; 
  productName: string; 
  quantity: number; 
  color: string; 
  size: string; 
  price: number; 
  shippingCost: number;
  subtotal: number;  
  orderTrack?: OrderTrack;
  user?: UserBriefDTO
}

export interface OrderDetailedDTO {
  orderId: string; 
  orderTrackingNumber: string;
  customerId: string; 
  productsCost: number;
  subtotal: number;
  shippingCost: number;
  total: number; 
  deliveryDays: number;
  deliveryDate: string;
  status: OrderStatus; 
  shippingAddress: Address; 
  orderDetails: OrderDetail[];
  orderDateTime: string; 
}

export interface OrderStatusUpdateRequest {
  status: OrderStatus; 
  notes: string; 
}

export interface CheckoutRequest {
  addressId: string; 
  paymentMethod: PaymentMethod;
}

export interface OrderTrack {
  updatedTime: string; 
  status: OrderStatus; 
  notes: string; 
}

export interface OrderMerchantDTO {
  orderId: string;
  orderTrackingNumber: string;
  customerId: string;
  merchantId: string;
  productId: string;
  productName: string;
  productImage: ImageDTO;
  quantity: number;
  color: string;
  size: string;
  price: number;
  subtotal: number;
  shippingCost: number;
  orderTrack: OrderTrack;
  paymentMethod: PaymentMethod;
  orderDateTime: string;
  deliveryDays: number;
  deliveryDate: string;
  shippingAddress: Address;
}