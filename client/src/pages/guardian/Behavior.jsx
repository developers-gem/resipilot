import {
  PageHeader,
  useResource,
  Modal,
  Field,
} from '../../components/guardian-ui.jsx';

import { useGuardianAuth } from '../../lib/guardianAuth.jsx';

export default function GuardianBehavior() {
const { guardian } = useGuardianAuth();
console.log("Guardian:", guardian);
const residentId = guardian?.resident?._id;

const behavioral = useResource(
  residentId
    ? `/behavioral-incidents/resident/${residentId}`
    : null
);
  return (
    <>
      <PageHeader title="Behavior Reports" />

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Resident</th>
              <th>Severity</th>
              <th>Behavior</th>
              <th>Location</th>
              <th>Duration</th>
            </tr>
          </thead>

          <tbody>
            {behavioral.items.map(item => (
              <tr key={item._id}>
                <td>{new Date(item.occurredAt).toLocaleDateString()}</td>

                <td>
                  {item.resident?.firstName}{" "}
                  {item.resident?.lastName}
                </td>

                <td>
                  <span
                    className={`badge ${
                      Number(item.severity) >= 4
                        ? "red"
                        : Number(item.severity) >= 3
                        ? "amber"
                        : "gray"
                    }`}
                  >
                    SEV {item.severity}
                  </span>
                </td>

                <td>{item.behavior}</td>

                <td>{item.location || "N/A"}</td>

                <td>
                  {item.durationMin
                    ? `${item.durationMin} min`
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}