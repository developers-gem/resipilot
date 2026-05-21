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
        <table>
          <thead><tr><th>Resident</th><th>Name</th><th>Dosage</th><th>Frequency</th><th>PRN</th><th></th></tr></thead>
          <tbody>
            {meds.items.length === 0 && <tr><td colSpan="6" className="muted">No medications.</td></tr>}
            {meds.items.map(m => (
              <tr key={m._id}>
                <td>{residents.find(r => r._id === m.resident)?.firstName || '—'}</td>
                <td>{m.name}</td>
                <td>{m.dosage}</td>
                <td>{m.frequency}</td>
                <td>{m.isPrn ? <span className="badge purple">PRN</span> : ''}</td>
                <td><button className="btn sm ghost" onClick={() => meds.remove(m._id)}><i className="ti ti-trash" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="section-title">Recent MAR entries</h3>
      <div className="table-wrap">
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
