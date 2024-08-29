export const storeUserData = (user: {
  id: number;
  email: string;
  name: string;
}) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUserData = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const removeUserData = () => {
  localStorage.removeItem('user');
};
