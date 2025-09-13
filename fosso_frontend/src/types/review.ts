import type { UserBriefDTO } from "./user";

export interface ReviewDTO {
  reviewId?: string;
  productId: string;
  productName: string;
  customerId: string;
  comment: string;
  rating: number;
  reviewDateTime?: string;
  user?: UserBriefDTO;
}