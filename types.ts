export enum Role {
  Admin = 'Admin',
  Librarian = 'Librarian',
  Reader = 'Reader',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
}

export enum BookStatus {
  Available = 'Available',
  Unavailable = 'Unavailable',
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  year: number;
  shelfNo: string;
  isbn?: string;
  quantity: number;
  available: number;
  status: BookStatus;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  returnDate?: string | null;
}

export enum RequestStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
}

export interface BookRequest {
  id: string;
  userId: string;
  bookId: string;
  requestDate: string;
  status: RequestStatus;
  resolvedDate?: string | null;
  resolverId?: string | null;
}
