import { useState } from 'react';
import { useResource, PageHeader, EmptyState } from '../components/ui.jsx';

export default function Discharge() {
  const residents = useResource('/residents').items;
  const [id, setId] = useState('');
  const r = residents.find(x => x._id === id);
  const steps = ['Discharge meeting', 'Records to guardian', 'Medication transfer', 'Final inspection', 'CDSS notification'];
  return (
    <>
      <PageHeader title="Discharge Planning" />
      <div className="card">
        <div className="field" style={{ maxWidth: 300 }}>
          <label>Resident</label>
          <select value={id} onChange={e => setId(e.target.value)}>
            <option value="">—</option>
            {residents.filter(r => r.isActive).map(r => <option key={r._id} value={r._id}>{r.firstName} {r.lastName}</option>)}
          </select>
        </div>
      </div>
      {!r ? <EmptyState icon="ti-logout" message="Pick a resident to start a discharge plan." /> : (
        <div className="card" style={{ marginTop: 14 }}>
          <h3>Checklist — {r.firstName} {r.lastName}</h3>
          {steps.map((s, i) => (
            <label key={i} className="row" style={{ padding: '6px 0', borderTop: i ? '1px solid var(--bdr)' : 0 }}>
              <input type="checkbox" /> {s}
            </label>
          ))}
          <button className="btn primary" style={{ marginTop: 12 }}><i className="ti ti-check" /> Mark discharged</button>
        </div>
      )}
    </>
  );
}
