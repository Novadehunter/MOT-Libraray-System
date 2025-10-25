import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { BookStatus } from '../types';
import { BookOpenIcon, ArrowPathIcon, ExclamationTriangleIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardCard: React.FC<{ title: string; value: number; icon: React.ElementType; colorClass: string; isVisible: boolean }> = ({ title, value, icon: Icon, colorClass, isVisible }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-lg flex items-center transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
    <div className={`text-white p-3 rounded-full mr-4 ${colorClass}`}>
      <Icon className="h-7 w-7" />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { books, users, borrowRecords } = useAppContext();
  const [cardsVisible, setCardsVisible] = useState(false);
  const BORROW_PERIOD_DAYS = 14;

  useEffect(() => {
    const timer = setTimeout(() => setCardsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const totalBooks = books.reduce((acc, book) => acc + book.quantity, 0);
  const borrowedBooks = books.reduce((acc, b) => acc + (b.quantity - b.available), 0);
  
  const overdueBooks = borrowRecords.filter(record => {
    if (record.returnDate) {
      return false; // Already returned
    }
    const dueDate = new Date(record.borrowDate);
    dueDate.setDate(dueDate.getDate() + BORROW_PERIOD_DAYS);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only
    return dueDate < today;
  }).length;

  const totalUsers = users.length;

  const categoryData = books.reduce((acc, book) => {
    const category = book.category;
    const existing = acc.find(item => item.name === category);
    if (existing) {
      existing.count += book.quantity;
    } else {
      acc.push({ name: category, count: book.quantity });
    }
    return acc;
  }, [] as { name: string; count: number }[]);
  
  const cardData = [
    { title: "Total Books (Copies)", value: totalBooks, icon: BookOpenIcon, colorClass: "bg-blue-500" },
    { title: "Books Borrowed", value: borrowedBooks, icon: ArrowPathIcon, colorClass: "bg-teal-500" },
    { title: "Books Overdue", value: overdueBooks, icon: ExclamationTriangleIcon, colorClass: "bg-amber-500" },
    { title: "Total Users", value: totalUsers, icon: UserGroupIcon, colorClass: "bg-indigo-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <div key={card.title} style={{ transitionDelay: `${index * 100}ms`}}>
            <DashboardCard {...card} isVisible={cardsVisible} />
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Books by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
            <Legend wrapperStyle={{fontSize: "14px"}}/>
            <Bar dataKey="count" fill="#14B8A6" name="No. of Copies" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;