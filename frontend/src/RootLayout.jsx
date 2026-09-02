import { Outlet } from '@tanstack/react-router';
import Navbar from './components/NavBar';

const RootLayout = () => {
  return (
    <div className='w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
