import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PageHeader } from '../../components/ui.jsx';
import { facilityApi } from '../../lib/facilityApi.js';

export default function BillingResidentProfile() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    loadResident();
  }, [id]);

  async function loadResident() {
    const result = await facilityApi.get(
      `/billing/residents/${id}`
    );

    setData(result);
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const { resident, billing } = data;

  return (
    <>
      <PageHeader
        title={`${resident.firstName} ${resident.lastName}`}
      />

      <div
        className="grid cols-4"
        style={{ marginBottom: 20 }}
      >
        <div className="card">
          <div className="muted">
            Current Payer
          </div>

          <h3>{billing.currentPayer}</h3>
        </div>

        <div className="card">
          <div className="muted">
            Outstanding Balance
          </div>

          <h3>
            $
            {billing.outstandingBalance.toFixed(2)}
          </h3>
        </div>

        <div className="card">
          <div className="muted">
            Active Services
          </div>

          <h3>{billing.activeServices}</h3>
        </div>

        <div className="card">
          <div className="muted">
            Last Invoice
          </div>

          <h3>
            {billing.lastInvoice || '-'}
          </h3>
        </div>
      </div>

      <div className="card">
        <h3>Resident Information</h3>

        <table>
          <tbody>
            <tr>
              <td>
                <strong>Name</strong>
              </td>

              <td>
                {resident.firstName}{' '}
                {resident.lastName}
              </td>
            </tr>

            <tr>
              <td>
                <strong>Room</strong>
              </td>

              <td>
                {resident.roomNumber || '-'}
              </td>
            </tr>

            <tr>
              <td>
                <strong>Status</strong>
              </td>

              <td>
                {resident.isActive
                  ? 'Active'
                  : 'Inactive'}
              </td>
            </tr>

            <tr>
              <td>
                <strong>Medicaid ID</strong>
              </td>

              <td>
                {resident.medicaidId || '-'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}