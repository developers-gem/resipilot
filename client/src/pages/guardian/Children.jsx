import {
  PageHeader,
  useResource,
  Modal,
  Field,
} from '../../components/guardian-ui.jsx';

import { useGuardianAuth } from '../../lib/guardianAuth.jsx';


export default function GuardianChildren() {
 const { guardian } = useGuardianAuth();

  const resident = guardian?.resident;
  return (
    <>
      <PageHeader title="My Children" />

    <div className="card">
  {!resident ? (
    <p>No resident assigned.</p>
  ) : (
    <div
      style={{
        padding: 16,
      }}
    >
      <h3>
        {resident.firstName} {resident.lastName}
      </h3>

      <p>
        <strong>Facility:</strong>{" "}
        {resident.facility?.name || "N/A"}
      </p>

      <p>
        <strong>Gender:</strong>{" "}
        {resident.gender || "N/A"}
      </p>

      <p>
        <strong>Date of Birth:</strong>{" "}
        {resident.dateOfBirth
          ? new Date(resident.dateOfBirth).toLocaleDateString()
          : "N/A"}
      </p>
    </div>
  )}
</div>
    </>
  );
}