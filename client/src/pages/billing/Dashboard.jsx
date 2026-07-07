import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui.jsx';
import { facilityApi } from '../../lib/facilityApi.js';

export default function BillingDashboard() {
  const [stats, setStats] = useState({
    activeResidents: 0,
    outstandingAR: 0,
    totalInvoiced: 0,
    overdueInvoices: 0,
    recentInvoices: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await facilityApi.get(
        '/billing/dashboard'
      );

      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p">Loading...</div>;
  }

  return (
    <>
      <PageHeader title="Billing Dashboard" />

      <div
        className="grid cols-4"
        style={{ marginBottom: 24 }}
      >
        <div className="card">
          <div className="muted">
            Active Residents
          </div>

          <h2>{stats.activeResidents}</h2>
        </div>

        <div className="card">
          <div className="muted">
            Outstanding A/R
          </div>

          <h2>
            $
            {stats.outstandingAR.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <div className="muted">
            Total Invoiced
          </div>

          <h2>
            $
            {stats.totalInvoiced.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <div className="muted">
            Overdue Invoices
          </div>

          <h2>{stats.overdueInvoices}</h2>
        </div>
      </div>

      <div className="card">
        <h3
          style={{
            marginTop: 0,
            marginBottom: 20,
          }}
        >
          Recent Invoices
        </h3>

        {stats.recentInvoices.length === 0 ? (
          <div className="muted">
            No invoices yet.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Resident</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {stats.recentInvoices.map(inv => (
                <tr key={inv._id}>
                  <td>{inv.number}</td>

                  <td>
                    {inv.residentName}
                  </td>

                  <td>
                    ${inv.amount}
                  </td>

                  <td>{inv.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}