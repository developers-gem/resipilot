import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { superAdminApi } from './superAdminApi.js';

const SuperAdminContext = createContext(null);

export function SuperAdminAuthProvider({
  children,
}) {
  const [admin, setAdmin] = useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem(
        'superAdminToken'
      );

    if (!token) {
      setLoading(false);
      return;
    }

    superAdminApi
      .get('/super-admin-auth/me')
      .then(r => setAdmin(r.admin))
      .catch(() => {
        localStorage.removeItem(
          'superAdminToken'
        );
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(
    email,
    password
  ) {
    const r =
      await superAdminApi.post(
        '/super-admin-auth/login',
        {
          email,
          password,
        }
      );

    localStorage.setItem(
      'superAdminToken',
      r.token
    );

    setAdmin(r.admin);
  }

  function logout() {
    localStorage.removeItem(
      'superAdminToken'
    );

    setAdmin(null);
  }

  return (
    <SuperAdminContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
}

export const useSuperAdminAuth = () =>
  useContext(SuperAdminContext);