import UrlForm from '../components/UrlForm';
import UserUrl from '../components/UserUrl';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <div className='w-full space-y-6'>
      <UrlForm />
      {isAuthenticated && <UserUrl />}
    </div>
  );
};

export default HomePage;
