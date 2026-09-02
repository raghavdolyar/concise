import React, { useState, useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthPage = () => {
  const location = useLocation();
  const isRegister = location.hash === 'register';
  const [login, setLogin] = useState(!isRegister);

  // Sync state if the hash changes while already on the page
  useEffect(() => {
    setLogin(location.hash !== 'register');
  }, [location.hash]);

  return (
    <div className='w-full'>
      {login ? (
        <LoginForm state={setLogin} />
      ) : (
        <RegisterForm state={setLogin} />
      )}
    </div>
  );
};

export default AuthPage;
