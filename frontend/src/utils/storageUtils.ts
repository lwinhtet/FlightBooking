export const storeUserData = (user: {
  id: number;
  email: string;
  name: string;
}) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getLocalStorageData = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const storeLocalStorageData = (key: string, data: unknown) => {
  return localStorage.setItem(key, JSON.stringify(data));
};

export const removeLocalStorageData = (key: string) => {
  localStorage.removeItem(key);
};
