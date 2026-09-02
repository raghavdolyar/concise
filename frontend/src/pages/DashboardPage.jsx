import UrlForm from '../components/UrlForm';
import UserUrl from '../components/UserUrl';

const DashboardPage = () => {
  return (
    <div className='w-full space-y-6'>
      <UrlForm />
      <UserUrl />
    </div>
  );
};

export default DashboardPage;
