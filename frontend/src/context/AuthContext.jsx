import { createContext, useState, useEffect, useContext } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  const register = async (name, email, password, role) => {
    const { data } = await API.post('/auth/register', { name, email, password, role });
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
