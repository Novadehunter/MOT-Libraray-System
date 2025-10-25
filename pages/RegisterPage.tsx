import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BookOpenIcon } from '@heroicons/react/24/solid';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(formData.name, formData.email);
      if (result.success) {
        addToast(result.message, 'success');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputClass = "relative block w-full px-4 py-3 text-slate-900 placeholder-slate-500 border border-slate-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <BookOpenIcon className="mx-auto h-12 w-auto text-teal-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Join the Ministry of Transport Library
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
              <input name="name" type="text" value={formData.name} onChange={handleChange} required className={`${inputClass} rounded-t-lg`} placeholder="Full Name" />
              <input name="email" type="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="Email address" />
              <input name="password" type="password" value={formData.password} onChange={handleChange} required className={inputClass} placeholder="Password (min. 6 characters)" />
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className={`${inputClass} rounded-b-lg`} placeholder="Confirm Password" />
          </div>
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          
          <div>
            <button type="submit" disabled={isLoading} className="group relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-teal-500 border border-transparent rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-300">
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          <div className="text-sm text-center">
            <p className="text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;