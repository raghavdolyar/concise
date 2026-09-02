import { useState } from 'react';
import { registerUser } from '../api/user.api';
import { useDispatch } from 'react-redux';
import { login } from '../store/slice/authSlice';
import { useNavigate } from '@tanstack/react-router';

const RegisterForm = ({ state }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await registerUser(name, password, email);
      setLoading(false);
      dispatch(login(data.user));
      navigate({ to: '/' });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Registration failed. Please try again.',
      );
    }
  };

  return (
    <div className='w-[400px] mx-auto border border-gray-300 bg-white mt-10'>
      <div className='bg-[#e1e1e1] px-3 py-1.5 border-b border-gray-300 font-bold text-[13px]'>
        Register a new account
      </div>
      <div className='p-6 space-y-4'>
        {error && (
          <div className='p-2 bg-red-100 border border-red-300 text-[#cc0000] text-[13px]'>
            {error}
          </div>
        )}

        <div className='flex items-center'>
          <label
            className='w-[100px] text-[13px] font-bold text-gray-700 text-right pr-4'
            htmlFor='name'
          >
            Name
          </label>
          <input
            className='flex-1 px-2 py-1.5 border border-gray-400 focus:outline-none focus:border-gray-500 text-[13px]'
            id='name'
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoComplete='off'
          />
        </div>

        <div className='flex items-center'>
          <label
            className='w-[100px] text-[13px] font-bold text-gray-700 text-right pr-4'
            htmlFor='email'
          >
            Email
          </label>
          <input
            className='flex-1 px-2 py-1.5 border border-gray-400 focus:outline-none focus:border-gray-500 text-[13px]'
            id='email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete='off'
          />
        </div>

        <div className='flex items-center'>
          <label
            className='w-[100px] text-[13px] font-bold text-gray-700 text-right pr-4'
            htmlFor='password'
          >
            Password
          </label>
          <input
            className='flex-1 px-2 py-1.5 border border-gray-400 focus:outline-none focus:border-gray-500 text-[13px]'
            id='password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete='new-password'
          />
        </div>

        <div className='flex items-center mt-6'>
          <div className='w-[100px]'></div>
          <button
            className={`bg-[#f8f8f8] text-black border border-gray-400 px-6 py-1 hover:bg-[#e8e8e8] text-[13px] cursor-pointer ${loading ? 'opacity-50' : ''}`}
            type='submit'
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>

        <div className='text-center mt-6 pt-4 border-t border-gray-200'>
          <p className='text-[13px] text-gray-600'>
            Already have an account?{' '}
            <span
              onClick={() => state(true)}
              className='text-[#0000ee] hover:text-[#cc0000] hover:underline cursor-pointer'
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
