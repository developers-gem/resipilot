import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { facilityApi } from './facilityApi.js';

const FacilityAuthContext = createContext(null);

export function FacilityAuthProvider({
  children,
}) {
  const [admin, setAdmin] = useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem(
        'facilityToken'
      );

    if (!token) {
      setLoading(false);
      return;
    }

    facilityApi
      .get('/facility-auth/me')
      .then(r => setAdmin(r.admin))
      .catch(() => {
        localStorage.removeItem(
          'facilityToken'
        );
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(
    email,
    password
  ) {
    const r =
      await facilityApi.post(
        '/facility-auth/login',
        {
          email,
          password,
        }
      );

    localStorage.setItem(
      'facilityToken',
      r.token
    );

    setAdmin(r.admin);
  }

  function logout() {
    localStorage.removeItem(
      'facilityToken'
    );

    setAdmin(null);
  }

  return (
    <FacilityAuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </FacilityAuthContext.Provider>
  );
}

export function useFacilityAuth() {
  return useContext(
    FacilityAuthContext
  );
}