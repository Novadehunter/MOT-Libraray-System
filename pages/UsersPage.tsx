import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Role, User } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';

const UsersPage: React.FC = () => {
  const { users, updateUser } = useAppContext();

  interface ActionToConfirm {
    user: User;
    type: 'role' | 'status';
    newValue: Role | boolean;
  }
  const [actionToConfirm, setActionToConfirm] = useState<ActionToConfirm | null>(null);

  const handleRoleChange = (user: User, newRole: Role) => {
    if (user.role !== newRole) {
      setActionToConfirm({ user, type: 'role', newValue: newRole });
    }
  };

  const handleStatusToggle = (user: User) => {
    setActionToConfirm({ user, type: 'status', newValue: !user.isActive });
  };

  const onConfirm = () => {
    if (!actionToConfirm) return;
    const { user, type, newValue } = actionToConfirm;
    
    if (type === 'role') {
      updateUser({ ...user, role: newValue as Role });
    } else {
      updateUser({ ...user, isActive: newValue as boolean });
    }

    setActionToConfirm(null);
  };

  const onCancel = () => {
    setActionToConfirm(null);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
        {/* Add User button can go here */}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-sm font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="p-4 font-semibold text-slate-800">{user.name}</td>
                <td className="p-4 text-slate-600">{user.email}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user, e.target.value as Role)}
                    className="w-full max-w-[140px] px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-label={`Change role for ${user.name}`}
                  >
                    {Object.values(Role).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4">
                   <button
                        onClick={() => handleStatusToggle(user)}
                        className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors w-24 text-center ${user.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
                        aria-label={`Change status for ${user.name}`}
                    >
                        {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {actionToConfirm && (
        <ConfirmationModal
          title={`Confirm Action`}
          message={
            actionToConfirm.type === 'role'
              ? `Are you sure you want to change ${actionToConfirm.user.name}'s role to ${actionToConfirm.newValue}?`
              : `Are you sure you want to ${actionToConfirm.newValue ? 'activate' : 'deactivate'} ${actionToConfirm.user.name}?`
          }
          onConfirm={onConfirm}
          onCancel={onCancel}
          confirmText="Confirm Change"
          confirmButtonClass="bg-teal-500 hover:bg-teal-600"
        />
      )}
    </div>
  );
};

export default UsersPage;