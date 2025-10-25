import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Book, Role, BookStatus, RequestStatus } from '../types';
import BookFormModal from '../components/BookFormModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generateSampleBooks } from '../services/geminiService';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const BooksPage: React.FC = () => {
  const { books, deleteBook, updateBook, borrowRecords, addBorrowRecord, updateBorrowRecord, requests, addRequest, loadSampleBooks } = useAppContext();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleDelete = (book: Book) => {
    setDeletingBook(book);
  };

  const confirmDelete = () => {
    if (deletingBook) {
      deleteBook(deletingBook.id);
      setDeletingBook(null);
      addToast(`"${deletingBook.title}" was deleted.`, 'success');
    }
  };

  const filteredBooks = useMemo(() =>
    books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase())
    ), [books, searchTerm]);

  const canManageBooks = currentUser?.role === Role.Admin || currentUser?.role === Role.Librarian;

  const handleRequestBorrow = (book: Book) => {
    if (!currentUser) return;
    if (isBorrowedByUser(book.id) || hasPendingRequest(book.id)) return;

    addRequest({
      bookId: book.id,
      userId: currentUser.id,
      requestDate: new Date().toISOString().split('T')[0],
      status: RequestStatus.Pending,
    });
    addToast(`Request for "${book.title}" submitted.`, 'success');
  };

  const handleReturn = (book: Book) => {
    if (currentUser) {
      const recordToReturn = borrowRecords.find(r => r.bookId === book.id && r.userId === currentUser.id && !r.returnDate);
      if (recordToReturn) {
        updateBorrowRecord({ ...recordToReturn, returnDate: new Date().toISOString().split('T')[0] });
        updateBook({ ...book, available: book.available + 1, status: BookStatus.Available });
        addToast(`"${book.title}" has been returned.`, 'success');
      }
    }
  };
  
  const handleGenerateSamples = async () => {
    setIsLoadingSamples(true);
    try {
      const sampleBooks = await generateSampleBooks(5);
      loadSampleBooks(sampleBooks);
      addToast("5 sample books generated successfully!", 'success');
    } catch (error) {
      console.error("Failed to generate sample books", error);
      addToast("Could not generate sample books.", 'error');
    } finally {
      setIsLoadingSamples(false);
    }
  };
  
  const isBorrowedByUser = (bookId: string) => {
    if (!currentUser) return false;
    return borrowRecords.some(r => r.bookId === bookId && r.userId === currentUser.id && !r.returnDate);
  };
  
  const hasPendingRequest = (bookId: string) => {
    if (!currentUser) return false;
    return requests.some(r => r.bookId === bookId && r.userId === currentUser.id && r.status === RequestStatus.Pending);
  };

  const buttonClasses = "px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const primaryButtonClasses = `${buttonClasses} bg-teal-500 hover:bg-teal-600 focus:ring-teal-500`;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Book Inventory</h2>
        <div className="flex items-center gap-2">
           {canManageBooks && (
            <button
              onClick={handleGenerateSamples}
              disabled={isLoadingSamples}
              className={`${buttonClasses} bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:scale-100`}
            >
              {isLoadingSamples ? 'Generating...' : '✨ Gen AI Samples'}
            </button>
          )}
          {canManageBooks && (
            <button onClick={handleAddNew} className={`${primaryButtonClasses} flex items-center`}>
              <PlusIcon className="h-5 w-5 mr-1" /> Add Book
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title, author, or category..."
          className="w-full max-w-lg px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-sm font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">Category</th>
              <th className="p-4">Available</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredBooks.map(book => (
              <tr key={book.id} className="hover:bg-slate-50">
                <td className="p-4 font-semibold text-slate-800">{book.title}</td>
                <td className="p-4 text-slate-600">{book.author}</td>
                <td className="p-4 text-slate-600">{book.category}</td>
                <td className="p-4 text-slate-600 font-medium">{book.available} / {book.quantity}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    book.status === BookStatus.Available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {book.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {currentUser?.role === Role.Reader && (
                    <>
                      {isBorrowedByUser(book.id) ? (
                        <button onClick={() => handleReturn(book)} className={`${buttonClasses} bg-amber-500 hover:bg-amber-600 focus:ring-amber-500`}>Return</button>
                      ) : hasPendingRequest(book.id) ? (
                         <button disabled className="px-3 py-1 text-sm text-slate-500 bg-slate-200 rounded-md cursor-not-allowed">Request Pending</button>
                      ) : (
                        <button onClick={() => handleRequestBorrow(book)} className={`${buttonClasses} bg-green-500 hover:bg-green-600 focus:ring-green-500`}>Request to Borrow</button>
                      )}
                    </>
                  )}
                  {canManageBooks && (
                    <div className="flex justify-center items-center gap-4">
                      <button onClick={() => handleEdit(book)} className="text-slate-500 hover:text-teal-500 transition-colors" title="Edit"><PencilIcon className="h-5 w-5"/></button>
                      <button onClick={() => handleDelete(book)} className="text-slate-500 hover:text-red-500 transition-colors" title="Delete"><TrashIcon className="h-5 w-5"/></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <BookFormModal book={editingBook} onClose={handleCloseModal} />}
      {deletingBook && (
        <ConfirmationModal
          title="Delete Book"
          message={`Are you sure you want to delete "${deletingBook.title}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingBook(null)}
          confirmText="Delete"
        />
      )}
    </div>
  );
};

export default BooksPage;