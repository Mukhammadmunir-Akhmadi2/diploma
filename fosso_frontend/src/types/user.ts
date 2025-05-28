import { type Gender } from "./enums";
import { type Role } from "./enums";
export interface UserProfileDTO {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isPhoneNumberPrivate: boolean;
  dateOfBirth: string;
  isDateOfBirthPrivate: boolean;
  gender: Gender;
  isGenderPrivate: boolean;
  imageId: string;
  roles: Role[];
}

export interface Address {
  addressId?: string;
  addressType: string;
  phoneNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
  country: string;
}

export interface UserBriefDTO {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageId: string;
}

export interface UserDetailedDTO {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roles: Role[];
  gender: Gender; 
  imageId: string;
  dateOfBirth: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserDTO {
  userId: string; 
  firstName: string;
  lastName: string; 
  email: string;  
  imageId: string;
  roles: Role[]; 
}

export interface UserUpdateDTO {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  isPhoneNumberPrivate?: boolean;
  gender: Gender | null;
  isGenderPrivate?: boolean;
  dateOfBirth: string | null;
  isDateOfBirthPrivate?: boolean;
}