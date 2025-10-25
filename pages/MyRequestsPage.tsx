import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { BookRequest, RequestStatus } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';

const MyRequestsPage: React.FC = () => {
  const { requests, books, cancelRequest } = useAppContext();
  const { currentUser } = useAuth();
  const [requestToCancel, setRequestToCancel] = useState<BookRequest | null>(null);

  const getBookTitle = (bookId: string) => books.find(b => b.id === bookId)?.title || 'Unknown Book';
  
  const getStatusColor = (status: RequestStatus) => {
    switch(status) {
        case RequestStatus.Approved: return 'bg-green-100 text-green-800';
        case RequestStatus.Rejected: return 'bg-red-100 text-red-800';
        case RequestStatus.Cancelled: return 'bg-slate-100 text-slate-800';
        case RequestStatus.Pending:
        default:
            return 'bg-yellow-100 text-yellow-800';
    }
  }
  
  const handleConfirmCancel = () => {
    if (requestToCancel) {
      cancelRequest(requestToCancel.id);
      setRequestToCancel(null);
    }
  }

  const myRequests = currentUser ? requests.filter(r => r.userId === currentUser.id) : [];

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">My Book Requests</h2>
        </div>
        <div className="overflow-x-auto">
          {myRequests.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Book Title</th>
                  <th className="p-4">Request Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {myRequests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()).map(request => (
                  <tr key={request.id} className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-800">{getBookTitle(request.bookId)}</td>
                    <td className="p-4 text-slate-600">{request.requestDate}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {request.status === RequestStatus.Pending && (
                        <button onClick={() => setRequestToCancel(request)} className="px-3 py-1 text-sm text-white bg-slate-500 rounded-md hover:bg-slate-600">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-slate-500 text-center py-8">You have not made any book requests.</p>
          )}
        </div>
      </div>
      {requestToCancel && (
        <ConfirmationModal
          title="Cancel Request"
          message={`Are you sure you want to cancel your request for "${getBookTitle(requestToCancel.bookId)}"?`}
          onConfirm={handleConfirmCancel}
          onCancel={() => setRequestToCancel(null)}
          confirmText="Yes, Cancel"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      )}
    </>
  );
};

export default MyRequestsPage;
