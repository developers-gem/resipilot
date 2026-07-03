import { useState } from 'react';
import {
  PageHeader,
  Field,
  Modal,
  EmptyState,
  useResource
} from '../components/ui.jsx';
import { adminApi as api } from '../lib/adminApi.js';

export default function GuardianPortal() {
  const [activeTab, setActiveTab] = useState('all');
  const [open, setOpen] = useState(false);

  const guardians = useResource('/guardians');
  const residents = useResource('/residents');
  const [search, setSearch] = useState('');

  const facilities = useResource('/facilities');

  const messages = useResource('/guardian-messages');

  const visits = useResource('/visits');
  const [selectedGuardian, setSelectedGuardian] = useState(null);


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
    contactAuthorization: 'Approved - Supervised Visits',
    backgroundCheckStatus: 'Pending',
    fosterLicenseNumber: '',
     password: '',
  confirmPassword: '',
  });
  const selectedResident = residents.items.find(
    r => r._id === form.resident
  );

  const selectedFacility = facilities.items.find(
    f => f._id === selectedResident?.facility
  );

  const [messageGuardian, setMessageGuardian] = useState(null);
  const [messageText, setMessageText] = useState('');

  const [visitGuardian, setVisitGuardian] = useState(null);
  const [visitDate, setVisitDate] = useState('');

  async function saveGuardian() {
    if (!form.resident) {
      return alert('Please select a resident');
    }

    if (!form.firstName.trim()) {
      return alert('First name is required');
    }

    if (!form.lastName.trim()) {
      return alert('Last name is required');
    }

    if (!form.relationship.trim()) {
      return alert('Relationship is required');
    }

    if (!form.phone.trim()) {
      return alert('Phone is required');
    }

    if (!form.email.trim()) {
  return alert('Email is required');
}

if (!form.password.trim()) {
  return alert('Password is required');
}

if (form.password.length < 6) {
  return alert('Password must be at least 6 characters');
}

if (form.password !== form.confirmPassword) {
  return alert('Passwords do not match');
}


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


  async function sendMessage() {
    if (!messageGuardian) return;

    await api.post('/guardian-messages/reply', {
      guardian: messageGuardian._id,
      resident:
        messageGuardian.resident?._id ||
        messageGuardian.resident,
      sender: 'Staff',
      message: messageText,
    });

    await messages.refresh();

    setMessageText('');
    setMessageGuardian(null);

    setActiveTab('messages');
  }

  async function openConversation(guardian) {
  setMessageGuardian(guardian);

  const unreadMessages = messages.items.filter(
    m =>
      m.guardian?._id === guardian._id &&
      m.sender === 'Guardian' &&
      !m.isRead
  );

  await Promise.all(
    unreadMessages.map(msg =>
      api.patch(`/guardian-messages/${msg._id}/read`)
    )
  );

  await messages.refresh();
}

  async function scheduleVisit() {
    if (!visitGuardian) return;

    await api.post('/visits', {
      guardian: visitGuardian._id,
      resident:
        visitGuardian.resident?._id ||
        visitGuardian.resident,
      scheduledFor: visitDate,
    });

    await visits.refresh();

    setVisitDate('');
    setVisitGuardian(null);

    setActiveTab('visits');
  }

 async function approveVisit(id) {
  await api.patch(`/visits/${id}/approve`);
  visits.refresh();
}

async function rejectVisit(id) {
  await api.patch(`/visits/${id}/reject`);
  visits.refresh();
}


const conversation = messageGuardian
  ? messages.items.filter(
      m => m.guardian?._id === messageGuardian._id
    )
  : [];






  return (
    <>
      <PageHeader
        title="Guardian Management"
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


      {/* Search */}
      <div className="card mb-4">
        <div
          style={{
            display: 'flex',
            gap: 20,
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: 10,
          }}
        >
          <button
            className={`btn ${activeTab === 'all' ? 'primary' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Guardians
          </button>

          <button
            className={`btn ${activeTab === 'visits' ? 'primary' : ''}`}
            onClick={() => setActiveTab('visits')}
          >
            Visit Schedule
          </button>

          <button

            className={`btn ${activeTab === 'messages' ? 'primary' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
        </div>
      </div>


      {/* Guardian Cards */}
      {activeTab === 'all' && (
        <>
         {filteredGuardians.map(g => {
  const unreadCount = messages.items.filter(
    m =>
      m.guardian?._id === g._id &&
      m.sender === 'Guardian' &&
      !m.isRead
  ).length;

  return (
    <div
      key={g._id}
      className="card"
      style={{
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        {/* Your existing card content */}

        <div>
          <h3>
            {g.firstName} {g.lastName}
          </h3>

          {/* ...rest of your card... */}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <button
            className="btn"
            onClick={() => setSelectedGuardian(g)}
          >
            Profile
          </button>

          <button
            className="btn primary"
            onClick={() => openConversation(g)}
          >
            Open Conversation

            {unreadCount > 0 && (
              <span
                className="badge red"
                style={{ marginLeft: 8 }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <button
            className="btn primary"
            onClick={() => setVisitGuardian(g)}
          >
            Schedule Visit
          </button>
        </div>
      </div>
    </div>
  );
})}
        </>
      )}

      {activeTab === 'visits' && (
        <div className="card">
          <h2>Visit Schedule</h2>

          <table>
            <thead>
              <tr>
                <th>Date</th>
    <th>Resident</th>
    <th>Guardian</th>
    <th>Status</th>
    <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visits.items.map(v => (
                <tr key={v._id}>
                  <td>
                    {new Date(v.scheduledFor).toLocaleString()}
                  </td>

                  <td>
                    {v.resident?.firstName} {v.resident?.lastName}
                  </td>

                  <td>
                    {v.guardian?.firstName} {v.guardian?.lastName}
                  </td>

                  <td>
                    <span className={`badge ${v.status === 'Approved'
                        ? 'green'
                        : v.status === 'Rejected'
                          ? 'red'
                          : 'amber'
                      }`}>
                      {v.status}
                    </span>
                  </td>

                  <td>
                    {v.status === 'Pending' && (
                      <>
                        <button
                          className="btn sm success"
                          onClick={() => approveVisit(v._id)}
                        >
                          Approve
                        </button>

                        <button
                          className="btn sm danger"
                          onClick={() => rejectVisit(v._id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>          </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {activeTab === 'messages' && (
        <div className="card">
          <h2>Messages</h2>

          {messages.items.map(m => (
            <div
              key={m._id}
              style={{
                padding: 12,
                borderBottom: '1px solid #eee'
              }}
            >
              <strong>
                {m.guardian?.firstName} {m.guardian?.lastName}
              </strong>

              <div>
                Resident:
                {' '}
                {m.resident?.firstName}
                {' '}
                {m.resident?.lastName}
              </div>

              <div>{m.message}</div>

              <small>
                {new Date(m.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}

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
              <Field label="Facility">
                <input
                  value={selectedFacility?.name || ''}
                  disabled
                />
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
                <select
                  value={form.contactAuthorization}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contactAuthorization: e.target.value
                    })
                  }
                >
                  <option value="Approved - Supervised Visits">
                    Approved - Supervised Visits
                  </option>

                  <option value="Approved - Unsupervised Visits">
                    Approved - Unsupervised Visits
                  </option>

                  <option value="Phone Only">
                    Phone Only
                  </option>

                  <option value="No Contact">
                    No Contact
                  </option>
                </select>
              </Field>
              <Field label="Background Check">
                <select
                  value={form.backgroundCheckStatus}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      backgroundCheckStatus: e.target.value
                    })
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Expired">Expired</option>
                </select>
              </Field>

              <Field label="Foster License Number">
                <input
                  value={form.fosterLicenseNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fosterLicenseNumber: e.target.value,
                    })
                  }
                />
              </Field>

              <Field label="Password">
  <input
    type="password"
    value={form.password}
    onChange={e =>
      setForm({
        ...form,
        password: e.target.value,
      })
    }
  />
</Field>

<Field label="Confirm Password">
  <input
    type="password"
    value={form.confirmPassword}
    onChange={e =>
      setForm({
        ...form,
        confirmPassword: e.target.value,
      })
    }
  />
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


      {selectedGuardian && (
        <Modal
          title="Guardian Profile"
          onClose={() => setSelectedGuardian(null)}
        >
          <p>
            <strong>Name:</strong>{' '}
            {selectedGuardian.firstName} {selectedGuardian.lastName}
          </p>

          <p>
            <strong>Relationship:</strong>{' '}
            {selectedGuardian.relationship}
          </p>

          <p>
            <strong>Resident:</strong>{' '}
            {selectedGuardian.resident?.firstName}{' '}
            {selectedGuardian.resident?.lastName}
          </p>

          <p>
            <strong>Facility:</strong>{' '}
            {selectedGuardian.resident?.facility?.name || 'N/A'}
          </p>

          <p>
            <strong>Phone:</strong>{' '}
            {selectedGuardian.phone}
          </p>

          <p>
            <strong>Email:</strong>{' '}
            {selectedGuardian.email}
          </p>

          <p>
            <strong>Address:</strong>{' '}
            {selectedGuardian.address}
          </p>

          <p>
            <strong>Contact Authorization:</strong>{' '}
            {selectedGuardian.contactAuthorization}
          </p>

          <p>
            <strong>Background Check:</strong>{' '}
            {selectedGuardian.backgroundCheckStatus}
          </p>
        </Modal>
      )}




     {messageGuardian && (
  <Modal
    title={`${messageGuardian.firstName} ${messageGuardian.lastName}`}
    onClose={() => setMessageGuardian(null)}
    footer={
      <>
        <button
          className="btn"
          onClick={() => setMessageGuardian(null)}
        >
          Close
        </button>

        <button
          className="btn primary"
          disabled={!messageText.trim()}
          onClick={sendMessage}
        >
          Send Reply
        </button>
      </>
    }
  >
    <div
      style={{
        maxHeight: 350,
        overflowY: 'auto',
        marginBottom: 20,
      }}
    >
      {conversation.length === 0 ? (
        <p className="muted">
          No messages yet.
        </p>
      ) : (
        conversation.map(msg => (
          <div
            key={msg._id}
            style={{
              marginBottom: 15,
              padding: 12,
              borderRadius: 8,
              background:
                msg.sender === 'Guardian'
                  ? '#eef6ff'
                  : '#f3f4f6',
            }}
          >
            <strong>
              {msg.sender}
            </strong>

            <div
              style={{
                marginTop: 6,
                marginBottom: 6,
              }}
            >
              {msg.message}
            </div>

            <small className="muted">
              {new Date(
                msg.createdAt
              ).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>

    <Field label="Reply">
      <textarea
        rows="4"
        placeholder="Type your reply..."
        value={messageText}
        onChange={e =>
          setMessageText(e.target.value)
        }
      />
    </Field>
  </Modal>
)}


      {visitGuardian && (
        <Modal
          title={`Schedule Visit - ${visitGuardian.firstName}`}
          onClose={() => setVisitGuardian(null)}
          footer={
            <button
              className="btn primary"
              onClick={scheduleVisit}
            >
              Schedule Visit
            </button>
          }
        >
          <Field label="Visit Date">
            <input
              type="datetime-local"
              value={visitDate}
              onChange={(e) =>
                setVisitDate(e.target.value)
              }
            />
          </Field>
        </Modal>
      )}
    </>
  );
}




