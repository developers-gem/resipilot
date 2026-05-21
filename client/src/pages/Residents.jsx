import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useResource, PageHeader, Modal, Field, EmptyState } from '../components/ui.jsx';

export default function Residents() {
  const { items, create, remove, loading } = useResource('/residents');
  const facilities = useResource('/facilities').items;
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = items.filter(r =>
    !search || `${r.firstName} ${r.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Residents" actions={
        <>
          <input className="search" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
                 style={{ padding: '7px 10px', border: '1px solid var(--bdr)', borderRadius: 'var(--rad-sm)', fontSize: 12.5 }} />
          <button className="btn primary" onClick={() => setShowAdd(true)}>
            <i className="ti ti-plus" /> Add Resident
          </button>
        </>
      } />

      <div className="table-wrap">
        <table>
          <thead><tr>
            <th>Name</th><th>DOB</th><th>Risk</th><th>Room</th><th>Facility</th><th>Status</th><th></th>
          </tr></thead>
          <tbody>
            {loading && <tr><td colSpan="7" className="muted">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan="7" className="muted">No residents yet.</td></tr>}
            {filtered.map(r => (
              <tr key={r._id}>
                <td><Link to={`/residents/${r._id}`} style={{ color: 'var(--blue)' }}>{r.firstName} {r.lastName}</Link></td>
                <td>{r.dateOfBirth?.slice(0,10)}</td>
                <td><span className={`badge ${r.riskLevel === 'high' ? 'red' : r.riskLevel === 'medium' ? 'amber' : 'green'}`}>{r.riskLevel}</span></td>
                <td>{r.roomNumber || '—'}</td>
                <td>{facilities.find(f => f._id === r.facility)?.name || '—'}</td>
                <td>{r.isActive ? <span className="badge green">active</span> : <span className="badge gray">inactive</span>}</td>
                <td><button className="btn sm ghost" onClick={() => remove(r._id)}><i className="ti ti-trash" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && <AddResidentModal facilities={facilities} onClose={() => setShowAdd(false)} onSave={async d => { await create(d); setShowAdd(false); }} />}
    </>
  );
}

function AddResidentModal({ facilities, onSave, onClose }) {
  const [d, setD] = useState({ firstName: '', lastName: '', dateOfBirth: '', riskLevel: 'low', roomNumber: '', facility: facilities[0]?._id || '' });
  return (
    <Modal title="Add resident" onClose={onClose} footer={
      <>
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" onClick={() => onSave(d)}>Create</button>
      </>
    }>
      <div className="grid cols-2">
        <Field label="First name"><input value={d.firstName} onChange={e => setD({ ...d, firstName: e.target.value })} /></Field>
        <Field label="Last name"><input value={d.lastName} onChange={e => setD({ ...d, lastName: e.target.value })} /></Field>
      </div>
      <Field label="Date of birth"><input type="date" value={d.dateOfBirth} onChange={e => setD({ ...d, dateOfBirth: e.target.value })} /></Field>
      <div className="grid cols-2">
        <Field label="Risk level">
          <select value={d.riskLevel} onChange={e => setD({ ...d, riskLevel: e.target.value })}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
        </Field>
        <Field label="Room number"><input value={d.roomNumber} onChange={e => setD({ ...d, roomNumber: e.target.value })} /></Field>
      </div>
      <Field label="Facility">
        <select value={d.facility} onChange={e => setD({ ...d, facility: e.target.value })}>
          {facilities.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
        </select>
      </Field>
    </Modal>
  );
}
