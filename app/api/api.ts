import axios from 'axios';
import type { AxiosPromise } from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutResponse,
  GetUserResponse,
  TotalUsersResponse,
  GetBooksResponse,
  GetBookResponse,
  AddBookRequest,
  AddBookResponse,
  UpdateBookRequest,
  UpdateBookResponse,
  DeleteBookResponse,
  TotalBooksResponse,
  GetBorrowingsResponse,
  GetBorrowingResponse,
  AddBorrowingRequest,
  AddBorrowingResponse,
  UpdateBorrowingRequest,
  UpdateBorrowingResponse,
  DeleteBorrowingResponse,
  TotalBorrowingsResponse,
  GetUsersResponse,
  BorrowingWithUserAndBook,
} from './types';

const API_BASE_URL = 'http://localhost:5005';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {

    return response;
  },
  (error) => {
    if (error.response) {
    
      const { status, data } = error.response;

      if (status === 401) {
        if (!window.location.pathname.includes('/login')) {
          console.error('Unauthorized - redirecting to login');
          window.location.href = '/login';
        }
      }

      if (status === 403) {
        console.error('Forbidden - insufficient permissions');
      }

      throw new Error(data.message || data.error || 'Request failed');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error(error.message || 'Request failed');
    }
  }
);

export const AuthApi = {
  login: (email: string, password: string): AxiosPromise<LoginResponse> => 
    apiClient.post<LoginResponse>('/auth/login', { email, password } as LoginRequest),
  
  register: (name: string, email: string, password: string): AxiosPromise<RegisterResponse> => 
    apiClient.post<RegisterResponse>('/auth/register', { name, email, password } as RegisterRequest),
  
  logout: (): AxiosPromise<LogoutResponse> => 
    apiClient.post<LogoutResponse>('/auth/logout'),
  
  getUser: (): AxiosPromise<GetUserResponse> => 
    apiClient.get<GetUserResponse>('/auth/user'),
  
  getTotalUsers: (): AxiosPromise<TotalUsersResponse> => 
    apiClient.get<TotalUsersResponse>('/auth/total-users'),

  getAllUsers :(search? : string): AxiosPromise<GetUsersResponse> => 
    apiClient.get<GetUsersResponse>('/auth/get-all-users', {params: {search:search}}),
}

export const BookApi = {
  getBooks: (search?: string): AxiosPromise<GetBooksResponse> => 
    apiClient.get<GetBooksResponse>('/books', { params: { search: search} }),
  
  getBook: (id: string): AxiosPromise<GetBookResponse> => 
    apiClient.get<GetBookResponse>(`/books/${id}`),
  
  addBook: (book: AddBookRequest): AxiosPromise<AddBookResponse> => 
    apiClient.post<AddBookResponse>('/books/add', book),
  
  updateBook: (id: string, book: UpdateBookRequest): AxiosPromise<UpdateBookResponse> => 
    apiClient.post<UpdateBookResponse>(`/books/update/${id}`, book),
  
  deleteBook: (id: string): AxiosPromise<DeleteBookResponse> => 
    apiClient.post<DeleteBookResponse>(`/books/delete/${id}`),
  
  getTotalBooks: (): AxiosPromise<TotalBooksResponse> => 
    apiClient.get<TotalBooksResponse>('/books/total-books'),
}

export const BorrowingApi = {
  getBorrowings: (): AxiosPromise<GetBorrowingsResponse> => 
    apiClient.get<GetBorrowingsResponse>('/borrowings'),
  
  getBorrowing: (id: string): AxiosPromise<GetBorrowingResponse> => 
    apiClient.get<GetBorrowingResponse>(`/borrowings/${id}`),
  
  addBorrowing: (borrowing: AddBorrowingRequest): AxiosPromise<AddBorrowingResponse> => 
    apiClient.post<AddBorrowingResponse>('/borrowings/add', borrowing),
  
  updateBorrowing: (borrowing: UpdateBorrowingRequest): AxiosPromise<UpdateBorrowingResponse> => 
    apiClient.post<UpdateBorrowingResponse>(`/borrowings/update`, borrowing),
  
  deleteBorrowing: (id: string): AxiosPromise<DeleteBorrowingResponse> => 
    apiClient.post<DeleteBorrowingResponse>(`/borrowings/delete/${id}`),
  
  getTotalBorrowings: (): AxiosPromise<TotalBorrowingsResponse> => 
    apiClient.get<TotalBorrowingsResponse>('/borrowings/total-borrowings'),
}