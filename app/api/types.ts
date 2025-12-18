

export interface User {
  name: string;
  email: string;
  createdAt?: string;
  borrowedBooks?: {
    bookId: string;
    title: string;
    author: string;
    borrowedAt: string;
    dueDate: string;
    returnedAt: string | null;
    status: string;
  }[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Borrowing {
  id: string;
  userId: string;
  bookId: string;
  borrowedAt: string;
  returnedAt?: string | null;
  dueDate?: string;
  status?: 'borrowed' | 'returned' | 'overdue';
  user?: User;
  book?: Book;
}


export interface BorrowingWithUserAndBook {
  borrowedBooks: Book[];
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  message?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  data: {
    user: User;
  }
  message?: string;
}

export interface LogoutResponse {
  message: string;
}

export interface GetUserResponse {
  data: {
    user: User;
  }
}

export interface GetUsersResponse {
  data: {
    users: User[];
  }
}


export interface TotalUsersResponse {
  data: {
    totalUsers: number;
  }
}


export interface GetBooksResponse {
  data: {
    books: Book[];
  }
}

export interface GetBookResponse {
  data: {
    book: Book;
  }
}

export interface AddBookRequest {
  title: string;
  author: string;
  isbn: string;
  quantity: number;
}

export interface AddBookResponse {
  data: {
    book: Book;
  }
  message?: string;
}

export interface UpdateBookRequest {
  isbn: string;
  title: string;
  author: string;
  quantity: number;
}

export interface UpdateBookResponse {
  data: {
    book: Book;
  }
  message?: string;
}

export interface DeleteBookResponse {
  message: string;
}

export interface TotalBooksResponse {
  data: {
    totalBooks: number;
  }
}



export interface GetBorrowingsResponse {
  data: {
    borrowedBooks: {
     id: string;
     title: string;
     author: string;
     isbn: string;
     quantity: number;
     borrowedAt: string;
     dueDate: string;
     returnedAt: string | null;
     status: string;
    }[];
  }
}

export interface GetBorrowingResponse {
  data: {
    borrowing: Borrowing;
  }
}

export interface AddBorrowingRequest {
  bookId: string;
  borrowedAt: string;
}

export interface AddBorrowingResponse {
  data: {
    duedate: string;
    borrowedAt: string;
    book: Book;
  }
  message?: string;
}

export interface UpdateBorrowingRequest {
  bookId: string;
  returnedAt: string;
  status: string;
}

export interface UpdateBorrowingResponse {
  data: {
    borrowing: Borrowing;
  }
  message?: string;
}

export interface DeleteBorrowingResponse {
  message: string;
}

export interface TotalBorrowingsResponse {
  data: {
    totalBorrowings: number;
  }
}

