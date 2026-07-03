import { createContext, useContext, useEffect, useState } from 'react';
import { adminApi  } from './adminApi.js';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    adminApi
      .get('/auth/me')
      .then(r => setUser(r.user))
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const r = await adminApi.post('/auth/login', {
      email,
      password,
    });

    localStorage.setItem('token', r.token);

    setUser(r.user);
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <Ctx.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);