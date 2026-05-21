import { useState } from 'react';
import { useResource, PageHeader, EmptyState } from '../components/ui.jsx';

export default function CourtReport() {
  const residents = useResource('/residents').items;
  const appts = useResource('/appointments').items;
  const incidents = useResource('/behavioral-incidents').items;
  const [residentId, setResidentId] = useState('');
  const r = residents.find(x => x._id === residentId);
  return (
    <>
      <PageHeader title="Court Reports" actions={
        <button className="btn primary" disabled={!r}><i className="ti ti-download" /> Generate PDF</button>
      } />
      <div className="card">
        <div className="field" style={{ maxWidth: 300 }}>
          <label>Select resident</label>
          <select value={residentId} onChange={e => setResidentId(e.target.value)}>
            <option value="">—</option>
            {residents.map(r => <option key={r._id} value={r._id}>{r.firstName} {r.lastName}</option>)}
          </select>
        </div>
      </div>
      {!r ? <EmptyState icon="ti-gavel" message="Pick a resident to preview a court report." /> : (
        <div className="card" style={{ marginTop: 14 }}>
          <h2 style={{ marginBottom: 12 }}>Court Report — {r.firstName} {r.lastName}</h2>
          <p><strong>DOB:</strong> {r.dateOfBirth?.slice(0,10)} • <strong>Risk:</strong> {r.riskLevel}</p>
          <h3 className="section-title">Court appointments</h3>
          <ul>{appts.filter(a => a.resident === r._id && a.apptType === 'court').map(a =>
            <li key={a._id}>{a.scheduledAt?.slice(0,10)} — {a.title}</li>) || <li>None</li>}
          </ul>
          <h3 className="section-title">Behavioral incidents (last 90 days)</h3>
          <ul>{incidents.filter(i => i.resident === r._id).slice(0,10).map(i =>
            <li key={i._id}>{i.occurredAt?.slice(0,10)} — SEV {i.severity} — {i.behavior?.slice(0,80)}</li>)}
          </ul>
        </div>
      )}
    </>
  );
}
