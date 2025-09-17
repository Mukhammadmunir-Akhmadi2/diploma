export interface CartItemCreateDTO {
  productId: string; 
  size: string; 
  color: string; 
  quantity: number; 
}

export interface CartItemDTO {
  cartId: string;
  customerId: string;
  productId: string;
  productName: string;
  productMainImgId: string;
  brandName: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  addedDateTime: string;
}

export interface CartResponse {
  cartItems: CartItemDTO[]; 
  totalItems: number; 
  totalAmount: number; 
}