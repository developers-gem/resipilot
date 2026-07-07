import { Navigate } from 'react-router-dom';
import { useFacilityAuth } from '../lib/facilityAuth.jsx';

export default function FacilityProtected({
  children,
}) {
  const { admin, loading } =
    useFacilityAuth();

  if (loading) {
    return (
      <div className="p">
        Loading...
      </div>
    );
  }

  if (!admin) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}