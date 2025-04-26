import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('authToken'); // Thay localStorage
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch('http://localhost:5001/api/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.sessionValid) {
          setUserData({
            username: data.username,
            role: data.role,
            Name: data.Name,
            MSSV: data.MSSV,
            SDT: data.SDT,
            Class: data.Class,
            email: data.email,
          });
        } else {
          sessionStorage.removeItem('authToken'); // Thay localStorage
          navigate('/');
        }
      })
      .catch((err) => {
        console.error('Lỗi khi lấy dữ liệu người dùng:', err);
        navigate('/');
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  return (
    <UserContext.Provider value={{ userData, setUserData, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};