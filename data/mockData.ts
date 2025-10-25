import { Book, User, BorrowRecord, Role, BookStatus, BookRequest, RequestStatus } from '../types';

const today = new Date();
const getDateString = (offsetDays: number = 0) => {
  const date = new Date(today);
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};

export const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@transport.gov', role: Role.Admin, isActive: true },
  { id: '2', name: 'Librarian User', email: 'librarian@transport.gov', role: Role.Librarian, isActive: true },
  { id: '3', name: 'Jane Doe', email: 'jane.doe@transport.gov', role: Role.Reader, isActive: true },
  { id: '4', name: 'John Smith', email: 'john.smith@transport.gov', role: Role.Reader, isActive: false },
];

export const mockBooks: Book[] = [
  { id: 'b1', title: 'The Future of Urban Mobility', author: 'A. B. Cde', publisher: 'Metropolis Books', category: 'Urban Planning', year: 2022, shelfNo: 'A1-01', isbn: '978-3-16-148410-0', quantity: 5, available: 3, status: BookStatus.Available },
  { id: 'b2', title: 'Logistics and Supply Chain Management', author: 'D. E. Fgh', publisher: 'Global Press', category: 'Logistics', year: 2021, shelfNo: 'B2-05', isbn: '978-1-4028-9462-6', quantity: 3, available: 3, status: BookStatus.Available },
  { id: 'b3', title: 'Principles of Pavement Engineering', author: 'G. H. Ijk', publisher: 'InfraStruct Publishing', category: 'Engineering', year: 2020, shelfNo: 'C3-10', isbn: '978-0-7506-8579-8', quantity: 2, available: 0, status: BookStatus.Unavailable },
  { id: 'b4', title: 'Transportation Policy and Planning', author: 'K. L. Mno', publisher: 'GovWorks', category: 'Policy', year: 2023, shelfNo: 'A1-02', isbn: '978-0-415-88336-7', quantity: 7, available: 7, status: BookStatus.Available },
];

export const mockBorrowRecords: BorrowRecord[] = [
  { id: 'br1', bookId: 'b1', userId: '3', borrowDate: getDateString(-20), returnDate: getDateString(-5) },
  { id: 'br2', bookId: 'b3', userId: '3', borrowDate: getDateString(-10), returnDate: null },
  { id: 'br3', bookId: 'b1', userId: '2', borrowDate: getDateString(-30), returnDate: null },
  { id: 'br4', bookId: 'b3', userId: '4', borrowDate: getDateString(-60), returnDate: getDateString(-45) },
];

export const mockRequests: BookRequest[] = [
  { id: 'req1', userId: '3', bookId: 'b4', requestDate: getDateString(-2), status: RequestStatus.Pending },
  { id: 'req2', userId: '4', bookId: 'b2', requestDate: getDateString(-5), status: RequestStatus.Approved, resolvedDate: getDateString(-4), resolverId: '2' },
  { id: 'req3', userId: '3', bookId: 'b1', requestDate: getDateString(-10), status: RequestStatus.Rejected, resolvedDate: getDateString(-9), resolverId: '2' },
];
