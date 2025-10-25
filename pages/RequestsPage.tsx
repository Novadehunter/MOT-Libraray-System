import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BookRequest, RequestStatus } from '../types';

const RequestsPage: React.FC = () => {
  const { requests, books, users, approveRequest, rejectRequest } = useAppContext();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  
  const getBookTitle = (bookId: string) => books.find(b => b.id === bookId)?.title || 'Unknown Book';
  const getUserName = (userId: string) => users.find(u => u.id === userId)?.name || 'Unknown User';

  const handleApprove = async (request: BookRequest) => {
    if (!currentUser) return;
    const result = await approveRequest(request.id, currentUser.id);
    if (result.success) {
      addToast('Request approved successfully.', 'success');
    } else if (result.message) {
      addToast(result.message, 'error');
    }
  };

  const handleReject = (request: BookRequest) => {
    if (!currentUser) return;
    rejectRequest(request.id, currentUser.id);
    addToast('Request rejected.', 'success');
  };

  const pendingRequests = requests.filter(r => r.status === RequestStatus.Pending);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Manage Book Requests</h2>
      </div>
      <div className="overflow-x-auto">
        {pendingRequests.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-sm font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="p-4">Book Title</th>
                <th className="p-4">Requested By</th>
                <th className="p-4">Request Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pendingRequests.sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime()).map(request => (
                <tr key={request.id} className="hover:bg-slate-50">
                  <td className="p-4 font-semibold text-slate-800">{getBookTitle(request.bookId)}</td>
                  <td className="p-4 text-slate-600">{getUserName(request.userId)}</td>
                  <td className="p-4 text-slate-600">{request.requestDate}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                        <button onClick={() => handleApprove(request)} className="px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">Approve</button>
                        <button onClick={() => handleReject(request)} className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-slate-500 text-center py-8">No pending requests.</p>
        )}
      </div>
    </div>
  );
};

export default RequestsPage;