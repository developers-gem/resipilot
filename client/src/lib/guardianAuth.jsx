import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  guardianApi,
} from './guardianApi.js';

const GuardianContext = createContext(null);

export function GuardianAuthProvider({ children }) {
  const [guardian, setGuardian] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('guardianToken');

    if (!token) {
      setLoading(false);
      return;
    }

    // IMPORTANT

    guardianApi
      .get('/guardian-auth/me')
      .then(r => setGuardian(r.guardian))
      .catch(() => {
        localStorage.removeItem('guardianToken');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const r = await guardianApi.post(
      '/guardian-auth/login',
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      'guardianToken',
      r.token
    );

    // IMPORTANT

    setGuardian(r.guardian);
  }

  function logout() {
    localStorage.removeItem('guardianToken');

    // IMPORTANT

    setGuardian(null);
  }

  return (
    <GuardianContext.Provider
      value={{
        guardian,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </GuardianContext.Provider>
  );
}

export const useGuardianAuth = () =>
  useContext(GuardianContext);