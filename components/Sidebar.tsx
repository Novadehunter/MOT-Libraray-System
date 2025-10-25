import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import {
  ChartBarIcon,
  BookOpenIcon,
  UsersIcon,
  DocumentChartBarIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: ChartBarIcon, roles: [Role.Admin, Role.Librarian, Role.Reader] },
    { to: '/books', label: 'Books', icon: BookOpenIcon, roles: [Role.Admin, Role.Librarian, Role.Reader] },
    ...(currentUser?.role !== Role.Reader ? [{ to: '/requests', label: 'Manage Requests', icon: ClipboardDocumentListIcon, roles: [Role.Admin, Role.Librarian] }] : []),
    ...(currentUser?.role === Role.Reader ? [{ to: '/my-requests', label: 'My Requests', icon: ClipboardDocumentCheckIcon, roles: [Role.Reader] }] : []),
    { to: '/users', label: 'Users', icon: UsersIcon, roles: [Role.Admin] },
    { to: '/reports', label: 'Reports', icon: DocumentChartBarIcon, roles: [Role.Admin, Role.Librarian] },
  ];

  const activeLinkClass = 'bg-teal-500 text-white';
  const inactiveLinkClass = 'text-slate-300 hover:bg-slate-700 hover:text-white';

  return (
    <aside className="bg-midnight text-white w-64 space-y-6 py-7 px-2 flex flex-col justify-between h-full">
      <div>
        <div className="text-white text-2xl font-semibold text-center mb-10 flex items-center justify-center">
          <BookOpenIcon className="h-8 w-8 inline-block mr-2" />
          <span className="font-bold">MoT Library</span>
        </div>
        <nav>
          {navLinks.filter(link => currentUser && link.roles.includes(currentUser.role)).map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              <link.icon className="h-6 w-6 mr-3" />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="px-4">
        <div className="border-t border-slate-700 py-4">
          <p className="font-semibold">{currentUser?.name}</p>
          <p className="text-sm text-slate-400">{currentUser?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;