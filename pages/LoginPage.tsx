import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpenIcon } from '@heroicons/react/24/solid';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = login(email);
    if (user) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or user is inactive.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
            <BookOpenIcon className="mx-auto h-12 w-auto text-teal-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
                MoT Library Portal
            </h2>
            <p className="mt-2 text-sm text-slate-600">
                Sign in to your account
            </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full px-4 py-3 text-slate-900 placeholder-slate-500 border border-slate-300 rounded-lg focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="group relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-teal-500 border border-transparent rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Sign in
            </button>
          </div>
          <div className="text-sm text-center">
             <p className="text-slate-500">
                Use a mock user email, e.g., 'admin@transport.gov' or 'jane.doe@transport.gov'.
             </p>
          </div>
          <div className="text-sm text-center">
            <p className="text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-teal-600 hover:text-teal-500">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;