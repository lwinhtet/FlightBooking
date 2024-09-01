import {
  getToken,
  setLoginCookie,
  setLogoutCookie,
} from '@/utils/responseHelper';
import { createContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { removeLocalStorageData, storeUserData } from '@/utils/storageUtils';

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  signup: (
    email: string,
    password: string,
    passwordConfirm: string,
    name: string
  ) => void;
  logout: () => void;
}

const initState: AuthContextType = {
  isAuthenticated: false,
  signup: () => {},
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(initState);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());

  const { toast } = useToast();

  useEffect(() => {
    // Check if token exists and set authentication state
    setIsAuthenticated(!!getToken());
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        setIsAuthenticated(true);
        const { token, data } = await response.json();
        setLoginCookie(token);
        storeUserData(data.user);
        toast({
          title: 'Login Successful!',
        });
      } else {
        alert('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again later.');
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => {
    try {
      console.log({ email, password, name, passwordConfirm });
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, name, passwordConfirm }),
        }
      );

      if (response.ok) {
        setIsAuthenticated(true);
        const { token, data } = await response.json();
        setLoginCookie(token);
        storeUserData(data.user);
        toast({
          title: 'Signup successful! You are now logged in.',
        });
      } else {
        alert('Signup failed. Please check your details and try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup. Please try again later.');
    }
  };

  const logout = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/users/logout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      removeLocalStorageData('user');
      setIsAuthenticated(false);
      setLogoutCookie();
    }

    close();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
