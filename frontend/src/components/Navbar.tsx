import { Link } from 'react-router-dom';
import MainAuthDialog from './auth/MainAuthDialog';
import useAuth from '@/hooks/useAuth';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onClickLogout = () => {
    logout();
    const currentPath = location.pathname;

    if (['/bookingDetails'].includes(currentPath)) {
      navigate('/', { replace: true });
    }
  };

  const authContent = isAuthenticated ? (
    <>
      <img
        src="/profiles/lwin.jpg"
        width={32}
        height={32}
        alt="Lwin logo"
        className="w-[32px] h-[32px] max-sm:w-[10px] max-sm:h-[10px] rounded-full"
        style={{
          width: '32px',
          height: '32px',
        }}
      />
      <Button variant="link" onClick={onClickLogout}>
        Logout
      </Button>
    </>
  ) : (
    <MainAuthDialog />
  );

  return (
    <nav className="flex-between fixed z-50 w-full bg-main-2 top-0 left-0 px-6 py-4 lg:px-20 shadow-sm">
      <Link to="/" className="flex items-center gap-1">
        <p className="text-[26px] font-extrabold text-my-primary max-sm:hidden">
          Lwin
        </p>
      </Link>
      <div className="flex-between gap-5">{authContent}</div>
    </nav>
  );
};

export default Navbar;
