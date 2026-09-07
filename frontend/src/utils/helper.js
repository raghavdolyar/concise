import { redirect } from '@tanstack/react-router';
import { getCurrentUser } from '../api/user.api';
import { login } from '../store/slice/authSlice';

export const checkAuth = async ({ context }) => {
  try {
    const { queryClient, store } = context;
    const user = await queryClient.ensureQueryData({
      queryKey: ['currentUser'],
      queryFn: getCurrentUser,
    });

    if (!user) throw redirect({ to: '/auth' });

    store.dispatch(login(user));

    const { isAuthenticated } = store.getState().auth;

    if (!isAuthenticated) throw redirect({ to: '/auth' });
    
    return true;
  } catch (error) {
    console.log(error);
    if (error.status === 302 || error.isRedirect) {
      throw error;
    }
    throw redirect({ to: '/auth' });
  }
};
