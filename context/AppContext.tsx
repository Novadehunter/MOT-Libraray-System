import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Book, User, BorrowRecord, BookRequest, BookStatus, RequestStatus } from '../types';
import { mockBooks, mockUsers, mockBorrowRecords, mockRequests } from '../data/mockData';
import { useToast } from './ToastContext';

interface AppContextType {
  books: Book[];
  users: User[];
  borrowRecords: BorrowRecord[];
  requests: BookRequest[];
  addBook: (bookData: Omit<Book, 'id' | 'available' | 'status'>) => void;
  updateBook: (updatedBook: Book) => void;
  deleteBook: (bookId: string) => void;
  addUser: (userData: Omit<User, 'id'>) => void;
  updateUser: (updatedUser: User) => void;
  addBorrowRecord: (record: Omit<BorrowRecord, 'id'>) => void;
  updateBorrowRecord: (updatedRecord: BorrowRecord) => void;
  addRequest: (request: Omit<BookRequest, 'id'>) => void;
  approveRequest: (requestId: string, resolverId: string) => Promise<{ success: boolean; message?: string }>;
  rejectRequest: (requestId: string, resolverId: string) => void;
  cancelRequest: (requestId: string) => void;
  loadSampleBooks: (sampleBooks: Omit<Book, 'id' | 'available' | 'status'>[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>(mockBorrowRecords);
  const [requests, setRequests] = useState<BookRequest[]>(mockRequests);
  const { addToast } = useToast();

  const generateId = () => `id_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;

  const addBook = useCallback((bookData: Omit<Book, 'id' | 'available' | 'status'>) => {
    const newBook: Book = {
      ...bookData,
      id: generateId(),
      available: bookData.quantity,
      status: bookData.quantity > 0 ? BookStatus.Available : BookStatus.Unavailable,
    };
    setBooks(prev => [...prev, newBook]);
  }, []);

  const updateBook = useCallback((updatedBook: Book) => {
    setBooks(prev => prev.map(book => book.id === updatedBook.id ? updatedBook : book));
  }, []);

  const deleteBook = useCallback((bookId: string) => {
    const isBorrowed = borrowRecords.some(r => r.bookId === bookId && !r.returnDate);
    if (isBorrowed) {
      addToast("Cannot delete book with active borrow records.", 'warning');
      return;
    }
    setBooks(prev => prev.filter(book => book.id !== bookId));
  }, [borrowRecords, addToast]);

  const addUser = useCallback((userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: generateId(),
    };
    setUsers(prev => [...prev, newUser]);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
  }, []);
  
  const addBorrowRecord = useCallback((recordData: Omit<BorrowRecord, 'id'>) => {
    const newRecord: BorrowRecord = {
      ...recordData,
      id: generateId(),
    };
    setBorrowRecords(prev => [...prev, newRecord]);
  }, []);

  const updateBorrowRecord = useCallback((updatedRecord: BorrowRecord) => {
     setBorrowRecords(prev => prev.map(rec => rec.id === updatedRecord.id ? updatedRecord : rec));
  }, []);

  const addRequest = useCallback((requestData: Omit<BookRequest, 'id'>) => {
    const newRequest: BookRequest = {
      ...requestData,
      id: generateId(),
    };
    setRequests(prev => [...prev, newRequest]);
  }, []);
  
  const rejectRequest = useCallback((requestId: string, resolverId: string) => {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;
      
      const updatedRequest = { ...request, status: RequestStatus.Rejected, resolvedDate: new Date().toISOString().split('T')[0], resolverId };
      setRequests(prev => prev.map(r => r.id === requestId ? updatedRequest : r));
  }, [requests]);

  const approveRequest = useCallback(async (requestId: string, resolverId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return { success: false, message: 'Request not found.' };

    const book = books.find(b => b.id === request.bookId);
    if (!book) return { success: false, message: 'Book not found.' };

    if (book.available <= 0) {
      rejectRequest(requestId, resolverId);
      return { success: false, message: `"${book.title}" is currently unavailable. The request has been automatically rejected.` };
    }
    
    addBorrowRecord({
      bookId: request.bookId,
      userId: request.userId,
      borrowDate: new Date().toISOString().split('T')[0],
      returnDate: null,
    });
    
    updateBook({ ...book, available: book.available - 1, status: (book.available - 1 > 0) ? BookStatus.Available : BookStatus.Unavailable });
    
    const updatedRequest = { ...request, status: RequestStatus.Approved, resolvedDate: new Date().toISOString().split('T')[0], resolverId };
    setRequests(prev => prev.map(r => r.id === requestId ? updatedRequest : r));
    
    return { success: true };
  }, [requests, books, addBorrowRecord, updateBook, rejectRequest]);
  
  const cancelRequest = useCallback((requestId: string) => {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;
      
      const updatedRequest = { ...request, status: RequestStatus.Cancelled, resolvedDate: new Date().toISOString().split('T')[0] };
      setRequests(prev => prev.map(r => r.id === requestId ? updatedRequest : r));
  }, [requests]);
  
  const loadSampleBooks = useCallback((sampleBooks: Omit<Book, 'id' | 'available' | 'status'>[]) => {
    const newBooks: Book[] = sampleBooks.map(b => ({
      ...b,
      id: generateId(),
      available: b.quantity,
      status: b.quantity > 0 ? BookStatus.Available : BookStatus.Unavailable
    }));
    setBooks(prev => [...prev, ...newBooks]);
  }, []);

  const value = {
    books,
    users,
    borrowRecords,
    requests,
    addBook,
    updateBook,
    deleteBook,
    addUser,
    updateUser,
    addBorrowRecord,
    updateBorrowRecord,
    addRequest,
    approveRequest,
    rejectRequest,
    cancelRequest,
    loadSampleBooks
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};