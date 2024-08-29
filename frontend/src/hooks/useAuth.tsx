import AuthContext, { AuthContextType } from '@/contexts/AuthProvider';
import { useContext } from 'react';

const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};

export default useAuth;
