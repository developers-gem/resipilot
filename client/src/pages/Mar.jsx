import { useState } from 'react';
import { useResource, PageHeader, Modal, Field } from '../components/ui.jsx';

export default function Mar() {
  const meds = useResource('/medications');
  const entries = useResource('/mar');
  const residents = useResource('/residents').items;
  const [showMed, setShowMed] = useState(false);
  return (
    <>
      <PageHeader title="MAR — Medications" actions={
        <button className="btn primary" onClick={() => setShowMed(true)}><i className="ti ti-plus" /> Add medication</button>
      } />
      <h3 className="section-title">Active medications</h3>
      <div className="table-wrap">
      <div
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  }}
>
  {meds.items.length === 0 && (
    <div className="empty">
      No medications.
    </div>
  )}

  {meds.items.map(m => {
    const resident = residents.find(
      r => r._id === m.resident
    );

    return (
      <div
        key={m._id}
        style={{
          background: '#fff',
          border: '1px solid var(--bdr)',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow:
            '0 2px 10px rgba(0,0,0,0.04)'
        }}
      >
        {/* TOP */}
        <div
          style={{
            padding: 18,
            borderBottom: '1px solid var(--bdr)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start'
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  marginBottom: 6
                }}
              >
                {resident?.firstName}{' '}
                {resident?.lastName}
              </div>

              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600
                }}
              >
                {m.name}
              </div>

              <div
                style={{
                  color: 'var(--tx3)',
                  marginTop: 6,
                  fontSize: 14
                }}
              >
                {m.dosage} · {m.frequency}
              </div>
            </div>

            <button
              className="btn sm ghost"
              onClick={() => meds.remove(m._id)}
            >
              <i className="ti ti-trash" />
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              marginTop: 16
            }}
          >
            <span className="badge green">
              Active
            </span>

            {m.isPrn && (
              <span className="badge purple">
                PRN
              </span>
            )}

            <span className="badge blue">
              MAR ready
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(3, 1fr)'
          }}
        >
          <button
            style={{
              border: 'none',
              background: '#f0fdf4',
              padding: 18,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              borderRight:
                '1px solid var(--bdr)'
            }}
          >
            ✓ Given
          </button>

          <button
            style={{
              border: 'none',
              background: '#fef2f2',
              padding: 18,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              borderRight:
                '1px solid var(--bdr)'
            }}
          >
            ✕ Refused
          </button>

          <button
            style={{
              border: 'none',
              background: '#fff',
              padding: 18,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Other
          </button>
        </div>
      </div>
    );
  })}
</div>
      </div>

<div
  style={{
    fontSize: 24,
    fontWeight: 700,
    marginTop: 34,
    marginBottom: 14
  }}
>
  MAR log — today
</div>      <div className="table-wrap">
        <table>
          <thead><tr><th>Scheduled</th><th>Status</th><th>Note</th></tr></thead>
          <tbody>
            {entries.items.length === 0 && <tr><td colSpan="3" className="muted">No MAR entries.</td></tr>}
            {entries.items.slice(0, 30).map(e => (
              <tr key={e._id}>
                <td>{new Date(e.scheduledAt).toLocaleString()}</td>
                <td><span className={`badge ${e.status === 'given' ? 'green' : e.status === 'missed' ? 'red' : 'gray'}`}>{e.status}</span></td>
                <td>{e.note || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showMed && <AddMed residents={residents} onClose={() => setShowMed(false)} onSave={async d => { await meds.create(d); setShowMed(false); }} />}
    </>
  );
}
function AddMed({ residents, onSave, onClose }) {
  const [d, setD] = useState({ resident: residents[0]?._id || '', name: '', dosage: '', frequency: 'BID', isPrn: false });
  return (
    <Modal title="Add medication" onClose={onClose} footer={
      <><button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" onClick={() => onSave(d)}>Save</button></>
    }>
      <Field label="Resident"><select value={d.resident} onChange={e => setD({ ...d, resident: e.target.value })}>
        {residents.map(r => <option key={r._id} value={r._id}>{r.firstName} {r.lastName}</option>)}
      </select></Field>
      <Field label="Name"><input value={d.name} onChange={e => setD({ ...d, name: e.target.value })} /></Field>
      <div className="grid cols-2">
        <Field label="Dosage"><input value={d.dosage} onChange={e => setD({ ...d, dosage: e.target.value })} placeholder="e.g. 10mg" /></Field>
        <Field label="Frequency"><input value={d.frequency} onChange={e => setD({ ...d, frequency: e.target.value })} placeholder="BID, QHS, etc." /></Field>
      </div>
      <label className="row"><input type="checkbox" checked={d.isPrn} onChange={e => setD({ ...d, isPrn: e.target.checked })} /> PRN (as-needed)</label>
    </Modal>
  );
}
