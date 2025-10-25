import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const getTitle = () => {
    const path = location.pathname.split('/')[1].replace('-', ' ');
    if (!path) return 'Dashboard';
    // Capitalize first letter of each word
    return path.replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <header className="bg-gradient-to-r from-midnight via-slate-800 to-slate-700 shadow-md flex items-center justify-between p-4">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="md:hidden mr-4 text-slate-300 hover:text-white">
          <Bars3Icon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-white tracking-tight">{getTitle()}</h2>
      </div>
      <div className="flex items-center space-x-4">
         <button className="text-slate-300 hover:text-white">
            <MagnifyingGlassIcon className="h-6 w-6" />
         </button>
         <button className="text-slate-300 hover:text-white">
            <BellIcon className="h-6 w-6" />
         </button>
      </div>
    </header>
  );
};

export default Header;