import type { Gender, Role } from "../enums";
import type { ImageDTO } from "../image";
import type { Address } from "../user";

export interface AdminUserBriefDTO {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
  image: ImageDTO | null; 
  enabled: boolean;
  roles: Role[]; 
  isDeleted: boolean; 
  createdDate: string;
  orderCount: number; 
  totalSpent: number; 
}

export interface AdminUserDetailDTO {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roles: Role[];
  gender: Gender; 
  image: ImageDTO | null; 
  dateOfBirth: string | null; 
  enabled: boolean; 
  banExpirationTime: string | null; 
  updatedBy: string | null; 
  createdTime: string; 
  updatedTime: string; 
  isDeleted: boolean; 
  addresses: Address[]; 
  orderCount: number; 
  totalSpent: number; 
}