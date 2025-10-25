
import React from 'react';
import { useAppContext } from '../context/AppContext';

const ReportsPage: React.FC = () => {
  const { borrowRecords, books, users } = useAppContext();

  const getBookTitle = (bookId: string) => books.find(b => b.id === bookId)?.title || 'Unknown Book';
  const getUserName = (userId: string) => users.find(u => u.id === userId)?.name || 'Unknown User';
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Borrowing History</h2>
        {/* Export button can go here */}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-sm text-slate-600">
            <tr>
              <th className="p-3">Book Title</th>
              <th className="p-3">User</th>
              <th className="p-3">Borrow Date</th>
              <th className="p-3">Return Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {borrowRecords.sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()).map(record => (
              <tr key={record.id} className="hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-800">{getBookTitle(record.bookId)}</td>
                <td className="p-3 text-slate-600">{getUserName(record.userId)}</td>
                <td className="p-3 text-slate-600">{record.borrowDate}</td>
                <td className="p-3 text-slate-600">
                  {record.returnDate ? record.returnDate : <span className="text-xs italic text-slate-500">Not Returned</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
