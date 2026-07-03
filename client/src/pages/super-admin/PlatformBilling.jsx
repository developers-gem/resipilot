import { useState } from 'react';

import { PageHeader } from '../../components/ui.jsx';

const billing = [
  {
    id: 1,
    facility: 'Sunrise Care',
    plan: 'Professional',
    cycle: 'Monthly',
    amount: '$299',
    renewal: '20 Jul 2026',
    status: 'Active',
  },
  {
    id: 2,
    facility: 'Hope Residential',
    plan: 'Starter',
    cycle: 'Monthly',
    amount: '$149',
    renewal: '15 Jul 2026',
    status: 'Trial',
  },
  {
    id: 3,
    facility: 'Oak Group Home',
    plan: 'Enterprise',
    cycle: 'Yearly',
    amount: '$7,999',
    renewal: '03 Jan 2027',
    status: 'Active',
  },
  {
    id: 4,
    facility: 'Green Valley',
    plan: 'Professional',
    cycle: 'Monthly',
    amount: '$299',
    renewal: '28 Jun 2026',
    status: 'Past Due',
  },
];

function badge(status) {
  switch (status) {
    case 'Active':
      return 'green';
    case 'Trial':
      return 'blue';
    case 'Past Due':
      return 'amber';
    case 'Cancelled':
      return 'red';
    default:
      return 'gray';
  }
}

export default function PlatformBilling() {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <PageHeader
        title="Platform Billing"
        actions={
          <button className="btn primary">
            <i className="ti ti-plus" />
            Create Invoice
          </button>
        }
      />

      {/* Stats */}
      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="muted">Monthly Revenue</div>
          <h2>$18,450</h2>
        </div>

        <div className="card">
          <div className="muted">Active Subscriptions</div>
          <h2>37</h2>
        </div>

        <div className="card">
          <div className="muted">MRR</div>
          <h2>$14,200</h2>
        </div>

        <div className="card">
          <div className="muted">Outstanding</div>
          <h2>$1,840</h2>
        </div>
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          marginBottom: 20,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <input
          placeholder="Search facility..."
          style={{ flex: 1 }}
        />

        <select>
          <option>All Plans</option>
          <option>Starter</option>
          <option>Professional</option>
          <option>Enterprise</option>
        </select>

        <select>
          <option>All Status</option>
          <option>Active</option>
          <option>Trial</option>
          <option>Past Due</option>
          <option>Cancelled</option>
        </select>

        <select>
          <option>Billing Cycle</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
      </div>

      {/* Table */}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Facility</th>
              <th>Plan</th>
              <th>Billing</th>
              <th>Amount</th>
              <th>Renewal</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {billing.map(item => (
              <tr key={item.id}>
                <td>{item.facility}</td>

                <td>{item.plan}</td>

                <td>{item.cycle}</td>

                <td>{item.amount}</td>

                <td>{item.renewal}</td>

                <td>
                  <span className={`badge ${badge(item.status)}`}>
                    {item.status}
                  </span>
                </td>

                <td>
                  <button
  className="btn sm"
  onClick={() => setSelected(item)}
>
  View
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {selected && (
  <>
    <div
      onClick={() => setSelected(null)}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.35)',
        zIndex: 90,
      }}
    />

    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 420,
        height: '100vh',
        background: '#fff',
        zIndex: 100,
        boxShadow: '-8px 0 30px rgba(0,0,0,.15)',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          padding: 24,
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            {selected.facility}
          </h2>

          <div className="muted">
            Subscription Details
          </div>
        </div>

        <button
          className="btn ghost"
          onClick={() => setSelected(null)}
        >
          <i className="ti ti-x" />
        </button>
      </div>

      <div style={{ padding: 24 }}>

        <div style={{ marginBottom: 20 }}>
          <div className="muted">Current Plan</div>
          <strong>{selected.plan}</strong>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="muted">Billing Cycle</div>
          <strong>{selected.cycle}</strong>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="muted">Subscription Fee</div>
          <strong>{selected.amount}</strong>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="muted">Renewal Date</div>
          <strong>{selected.renewal}</strong>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="muted">Status</div>

          <span className={`badge ${badge(selected.status)}`}>
            {selected.status}
          </span>
        </div>

        <hr />

        <div style={{ marginTop: 20 }}>

          <button
            className="btn primary"
            style={{ width: '100%', marginBottom: 12 }}
          >
            Upgrade Plan
          </button>

          <button
            className="btn"
            style={{ width: '100%', marginBottom: 12 }}
          >
            Suspend Subscription
          </button>

          <button
            className="btn danger"
            style={{ width: '100%' }}
          >
            Cancel Subscription
          </button>

        </div>

      </div>
    </div>
  </>
)}
    </>



  );
}