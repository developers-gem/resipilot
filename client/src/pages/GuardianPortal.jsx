import { useState } from 'react';
import {
  PageHeader,
  Field,
  Modal,
  EmptyState,
  useResource
} from '../components/ui.jsx';
export default function GuardianPortal() {
  const [open, setOpen] = useState(false);

  const guardians = useResource('/guardians');
const residents = useResource('/residents');
const [search, setSearch] = useState('');

const filteredGuardians = guardians.items.filter(g => {
  const q = search.toLowerCase();

  return (
    `${g.firstName || ''} ${g.lastName || ''}`
      .toLowerCase()
      .includes(q) ||

    `${g.resident?.firstName || ''} ${g.resident?.lastName || ''}`
      .toLowerCase()
      .includes(q)
  );
});
  const [form, setForm] = useState({
    type: 'Biological Family',
    firstName: '',
    lastName: '',
    relationship: '',
    resident: '',
    phone: '',
    email: '',
    address: '',
    contactAuthorization: '',
    backgroundCheckStatus: '',
    fosterLicenseNumber: ''
  });

  return (
    <>
      <PageHeader
        title="Guardian Portal"
        actions={
          <>
            <button className="btn">
              <i className="ti ti-download" /> Export
            </button>

            <button
              className="btn primary"
              onClick={() => setOpen(true)}
            >
              <i className="ti ti-user-plus" /> Add Guardian
            </button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid cols-4 mb-4">
        <div className="card">
          <div className="muted">Total Guardians</div>
<h2>{guardians.items.length}</h2>        </div>

        <div className="card">
          <div className="muted">Visits This Month</div>
          <h2>14</h2>
        </div>

        <div className="card">
          <div className="muted">Pending Approvals</div>
<h2>
  {
    guardians.items.filter(
      g => g.backgroundCheckStatus === 'Pending'
    ).length
  }
</h2>        </div>

        <div className="card">
          <div className="muted">No Contact Orders</div>
         <h2>
  {
    guardians.items.filter(
      g => g.contactAuthorization === 'No Contact'
    ).length
  }
</h2>
        </div>
      </div>

      {/* Alert */}
      <div
        className="card"
        style={{
          borderLeft: '4px solid #dc2626',
          marginBottom: 20
        }}
      >
        <strong>No-contact orders active:</strong>
        {' '}
        Do not share resident location, school, or placement details.
      </div>

      {/* Search */}
      <div className="card mb-4">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 180px 180px',
            gap: 12
          }}
        >
        <input
  value={search}
  onChange={e => setSearch(e.target.value)}
  placeholder="Search guardians by name or resident..."
/>

         <select>
  <option value="">
    All Residents
  </option>

  {residents.items.map(r => (
    <option
      key={r._id}
      value={r._id}
    >
      {r.firstName} {r.lastName}
    </option>
  ))}
</select>

          <select>
            <option>All Types</option>
          </select>
        </div>
      </div>

      {/* Guardian Cards */}
{filteredGuardians.map(g => (
          <div
          key={g._id}
          className="card"
          style={{
            marginBottom: 16
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 20
            }}
          >
            <div>
              <h3>
                {g.firstName} {g.lastName}
              </h3>

              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                  marginBottom: 10
                }}
              >
                <span className="badge success">
{g.contactAuthorization}                </span>

                <span className="badge">
                  {g.type}
                </span>

                <span className="badge">
                  {g.relationship}
                </span>
              </div>

              <p>
<strong>Resident:</strong>{' '}
{g.resident
  ? `${g.resident.firstName} ${g.resident.lastName}`
  : 'Not Assigned'}              </p>

              <p>
                <strong>Phone:</strong> {g.phone}
              </p>

              <p>
                <strong>Email:</strong> {g.email}
              </p>

              <p>
                <strong>Visits Allowed:</strong> {g.visitsAllowed || 'N/A'}
              </p>

              <p>
                <strong>Last Visit:</strong> {g.lastVisit
  ? new Date(g.lastVisit).toLocaleDateString()
  : 'No visits'}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start'
              }}
            >
              <button className="btn">
                Profile
              </button>

              <button className="btn">
                Message
              </button>

              <button className="btn primary">
                Schedule Visit
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add Guardian Modal */}
      {open && (
        <div className="modal-backdrop">
          <div
            className="card"
            style={{
              width: 900,
              maxWidth: '95vw',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 20
              }}
            >
              <h2>Add Guardian / Foster Family</h2>

              <button
                className="btn"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="grid cols-2">
              <Field label="Guardian Type">
                <select
                  value={form.type}
                  onChange={e =>
                    setForm({
                      ...form,
                      type: e.target.value
                    })
                  }
                >
                  <option>Biological Family</option>
                  <option>Foster Family</option>
                  <option>Kinship Guardian</option>
                  <option>Legal Guardian</option>
                </select>
              </Field>

             <Field label="Connected Resident">
  <select
    value={form.resident}
    onChange={e =>
      setForm({
        ...form,
        resident: e.target.value
      })
    }
  >
    <option value="">
      Select Resident
    </option>

    {residents.items.map(r => (
      <option
        key={r._id}
        value={r._id}
      >
        {r.firstName} {r.lastName}
      </option>
    ))}
  </select>
</Field>

              <Field label="First Name">
                <input
                  value={form.firstName}
                  onChange={e =>
                    setForm({
                      ...form,
                      firstName: e.target.value
                    })
                  }
                />
              </Field>

              <Field label="Last Name">
                <input
                  value={form.lastName}
                  onChange={e =>
                    setForm({
                      ...form,
                      lastName: e.target.value
                    })
                  }
                />
              </Field>

              <Field label="Relationship">
                <input
                  value={form.relationship}
                  onChange={e =>
                    setForm({
                      ...form,
                      relationship: e.target.value
                    })
                  }
                />
              </Field>

              <Field label="Phone">
                <input
                  value={form.phone}
                  onChange={e =>
                    setForm({
                      ...form,
                      phone: e.target.value
                    })
                  }
                />
              </Field>

              <Field label="Email">
                <input
                  value={form.email}
                  onChange={e =>
                    setForm({
                      ...form,
                      email: e.target.value
                    })
                  }
                />
              </Field>

              <Field label="Address">
                <input
                  value={form.address}
                  onChange={e =>
                    setForm({
                      ...form,
                      address: e.target.value
                    })
                  }
                />
              </Field>

              <Field label="Contact Authorization">
                <select>
                  <option>
                    Approved - Supervised Visits
                  </option>
                  <option>
                    Approved - Unsupervised Visits
                  </option>
                  <option>Phone Only</option>
                  <option>No Contact</option>
                </select>
              </Field>

              <Field label="Background Check">
                <select>
                  <option>Pending</option>
                  <option>Cleared</option>
                  <option>Expired</option>
                </select>
              </Field>

              <Field label="Foster License Number">
                <input />
              </Field>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                marginTop: 20
              }}
            >
              <button
                className="btn"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              <button
  className="btn primary"
  onClick={saveGuardian}
>
  Save Guardian
</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

async function saveGuardian() {
  try {
    await guardians.create(form);

    setOpen(false);

    setForm({
      type: 'Biological Family',
      firstName: '',
      lastName: '',
      relationship: '',
      resident: '',
      phone: '',
      email: '',
      address: '',
      contactAuthorization:
        'Approved - Supervised Visits',
      backgroundCheckStatus:
        'Pending',
      fosterLicenseNumber: ''
    });
  } catch (err) {
    alert(err.message);
  }
}