import { Navigate } from 'react-router-dom';
import { useGuardianAuth } from '../lib/guardianAuth.jsx';

export default function GuardianProtected({ children }) {
  const { guardian, loading } = useGuardianAuth();

  if (loading) {
    return <div className="p">Loading...</div>;
  }

  if (!guardian) {
    return <Navigate to="/guardian-login" replace />;
  }

  return children;
}