import React, { useState, useEffect } from 'react';
import { Book, BookStatus } from '../types';
import { useAppContext } from '../context/AppContext';

interface BookFormModalProps {
  book: Book | null;
  onClose: () => void;
}

const BookFormModal: React.FC<BookFormModalProps> = ({ book, onClose }) => {
  const { addBook, updateBook } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    category: '',
    year: '',
    shelfNo: '',
    isbn: '',
    quantity: '1',
  });

  useEffect(() => {
    setIsVisible(true);
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        category: book.category,
        year: book.year.toString(),
        shelfNo: book.shelfNo,
        isbn: book.isbn || '',
        quantity: book.quantity.toString(),
      });
    }
  }, [book]);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bookData = {
      ...formData,
      year: parseInt(formData.year, 10),
      quantity: parseInt(formData.quantity, 10) || 1,
    };

    if (book) {
      const borrowedCount = book.quantity - book.available;
      const newAvailable = bookData.quantity - borrowedCount;

      if (newAvailable < 0) {
        alert(`Quantity cannot be less than the number of currently borrowed books (${borrowedCount}).`);
        return;
      }

      updateBook({ 
        ...book, 
        ...bookData,
        available: newAvailable,
        status: newAvailable > 0 ? BookStatus.Available : BookStatus.Unavailable
      });
    } else {
      const { title, author, publisher, category, year, shelfNo, isbn, quantity } = bookData;
      addBook({ title, author, publisher, category, year, shelfNo, isbn, quantity });
    }
    handleClose();
  };
  
  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500";

  return (
    <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl m-4 transition-all duration-300 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <h2 className="text-2xl font-bold mb-6 text-slate-800">{book ? 'Edit Book' : 'Add New Book'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className={inputClass} />
            <input name="author" value={formData.author} onChange={handleChange} placeholder="Author" required className={inputClass} />
            <input name="publisher" value={formData.publisher} onChange={handleChange} placeholder="Publisher" required className={inputClass} />
            <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" required className={inputClass} />
            <input name="year" value={formData.year} onChange={handleChange} placeholder="Year" type="number" required className={inputClass} />
            <input name="shelfNo" value={formData.shelfNo} onChange={handleChange} placeholder="Shelf No." required className={inputClass} />
             <input name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" type="number" min="1" required className={inputClass} />
          </div>
          <input name="isbn" value={formData.isbn} onChange={handleChange} placeholder="ISBN (Optional)" className={inputClass} />
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={handleClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-semibold shadow-md">{book ? 'Save Changes' : 'Add Book'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormModal;