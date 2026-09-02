import React from 'react';
import { Link, useNavigate, useLocation } from '@tanstack/react-router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slice/authSlice';
import { logoutUser } from '../api/user.api';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate({ to: '/' });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const currentPath = location.pathname;

  return (
    <div className='w-full'>
      <div className='flex justify-end pt-2 pb-4 text-[13px] font-bold space-x-2 items-center'>
        {isAuthenticated ? (
          <>
            <span className='text-gray-700 font-normal mr-2'>
              Welcome,{' '}
              <Link to='/' className='font-bold text-black hover:underline'>
                {user?.name || 'User'}
              </Link>
            </span>
            <button
              onClick={handleLogout}
              className='bg-[#f8f8f8] text-black border border-gray-400 px-4 py-1 hover:bg-[#e8e8e8] text-[13px] cursor-pointer'
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to='/auth'
              hash='login'
              className='bg-[#f8f8f8] text-black border border-gray-400 px-4 py-1 hover:bg-[#e8e8e8] text-[13px] cursor-pointer no-underline'
            >
              Enter
            </Link>
            <Link
              to='/auth'
              hash='register'
              className='bg-[#f8f8f8] text-black border border-gray-400 px-4 py-1 hover:bg-[#e8e8e8] text-[13px] cursor-pointer no-underline'
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Main Logo */}
      <div className='mb-4 flex items-end'>
        <Link to='/' className='text-3xl font-bold font-serif tracking-tight'>
          <span className='text-gray-800'>URL</span>
          <span className='text-[#3b5998]'>Shortener</span>
        </Link>
      </div>

      {/* Codeforces Style Menu Bar */}
      <div className='border-t-[3px] border-[#3b5998] border-b border-gray-300 bg-[#f8f8f8] border-l border-r mb-6 rounded-t-sm'>
        <ul className='flex list-none m-0 p-0'>
          <li>
            <Link
              to='/'
              className={`block px-5 py-2 text-[13px] font-bold border-r border-gray-300 ${
                currentPath === '/'
                  ? 'bg-white text-black'
                  : 'text-[#0000ee] hover:text-[#cc0000]'
              }`}
            >
              HOME
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
