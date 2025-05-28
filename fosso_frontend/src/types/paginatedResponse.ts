export interface PaginatedResponse<T> {
  products: T[]; 
  currentPage: number; 
  totalItems: number; 
  totalPages: number;
}
