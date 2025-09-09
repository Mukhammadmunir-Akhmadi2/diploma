export interface AuthResponse {
  accessToken: string;
  tokenType: string; 
}

export interface AuthRequest {
  email: string; 
  password: string; 
}

export interface RegisterRequest {
  firstName: string; 
  lastName: string | null;
  email: string; 
  password: string; 
  phoneNumber?: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  phoneNumber: string;
}
