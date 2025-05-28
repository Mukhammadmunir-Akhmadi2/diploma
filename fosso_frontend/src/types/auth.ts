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
