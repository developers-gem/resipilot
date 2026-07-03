import { Navigate } from 'react-router-dom';

import { useSuperAdminAuth } from '../lib/superAdminAuth.jsx';

export default function SuperAdminProtected({
  children,
}) {
  const { admin, loading } =
    useSuperAdminAuth();

  if (loading) {
    return <div className="p">Loading...</div>;
  }

  if (!admin) {
    return (
      <Navigate
        to="/super-admin/login"
        replace
      />
    );
  }

  return children;
}