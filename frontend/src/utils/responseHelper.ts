import Cookies from 'js-cookie';

interface CookieOptions {
  expires: Date | number | undefined;
  sameSite: 'Lax' | 'Strict' | 'None';
  path: string;
  secure?: boolean;
}

export const getToken = (): string | undefined => {
  return Cookies.get('accessToken');
};

export const setToken = (token: string): void => {
  Cookies.set('accessToken', token, { expires: 7, sameSite: 'Lax' }); // Adjust options as needed
};

export const removeToken = (): void => {
  Cookies.remove('accessToken');
};

export const setLoginCookie = (token: string): void => {
  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() +
        (Number(import.meta.env.VITE_JWT_COOKIE_EXPIRES_IN) || 7) *
          24 *
          60 *
          60 *
          1000
    ), // Default to 7 days if env var is not set
    sameSite: 'Lax',
    path: '/',
  };

  // Secure cookie in production
  if (import.meta.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  Cookies.set('accessToken', token, cookieOptions);
};

export const setLogoutCookie = (): void => {
  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + 2 * 1000), // 10 seconds expiration
    sameSite: 'Lax',
    path: '/',
  };

  // Secure cookie in production
  if (import.meta.env.VITE_NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  Cookies.set('accessToken', 'logged-out', cookieOptions);
};
