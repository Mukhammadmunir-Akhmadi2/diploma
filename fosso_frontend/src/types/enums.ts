export type Gender = "MALE" | "FEMALE" | "UNISEX";

export type Role = "USER" | "MERCHANT" | "ADMIN";

export type ImageType =
  | "USER_AVATAR"
  | "PRODUCT_IMAGE"
  | "PRODUCT_IMAGE_MAIN"
  | "CATEGORY_IMAGE"
  | "BANNER_IMAGE"
  | "BRAND_IMAGE"
  | "ORDER_IMAGE"
  | "OTHER";

export type OrderStatus =
  | "NEW"
  | "PROCESSING"
  | "CANCELLED"
  | "SHIPPED"
  | "DELIVERED"
  | "RETURNED"
  | "PAID"
  | "COMPLETED"
  | "REFUNDED";

export type PaymentMethod = "CARD" | "CASH_ON_DELIVERY";

export type Season = "SUMMER" | "WINTER" | "SPRING" | "FALL" | "ALL_SEASON";