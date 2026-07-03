import { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi as api } from '../lib/adminApi.js';
import { PageHeader } from '../components/ui.jsx';

export default function Search() {
  const [q, setQ] = useState('');
  const [res, setRes] = useState(null);
  async function run() {
    if (!q) return;
    const [residents, staff, facilities] = await Promise.all([
      api.get('/residents').catch(() => []),
      api.get('/staff').catch(() => []),
      api.get('/facilities').catch(() => []),
    ]);
    const ql = q.toLowerCase();
    setRes({
      residents: residents.filter(r => (`${r.firstName} ${r.lastName}`).toLowerCase().includes(ql)),
      staff:     staff.filter(s => (s.employeeId || '').toLowerCase().includes(ql) || (s.title || '').toLowerCase().includes(ql)),
      facilities: facilities.filter(f => f.name.toLowerCase().includes(ql) || (f.slug || '').toLowerCase().includes(ql)),
    });
  }
  return (
    <>
      <PageHeader title="Global search" />
      <div className="card">
        <div className="row">
          <input style={{ flex: 1, padding: '8px 10px', border: '1px solid var(--bdr)', borderRadius: 'var(--rad-sm)' }}
                 placeholder="Search residents, staff, facilities…" value={q}
                 onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && run()} />
          <button className="btn primary" onClick={run}><i className="ti ti-search" /> Search</button>
        </div>
      </div>
      {res && (
        <>
          <h3 className="section-title">Residents ({res.residents.length})</h3>
          {res.residents.map(r => <Link key={r._id} to={`/residents/${r._id}`} className="card" style={{ display: 'block', marginBottom: 6 }}>{r.firstName} {r.lastName}</Link>)}
          <h3 className="section-title">Staff ({res.staff.length})</h3>
          {res.staff.map(s => <div key={s._id} className="card" style={{ marginBottom: 6 }}>{s.employeeId} — {s.title}</div>)}
          <h3 className="section-title">Facilities ({res.facilities.length})</h3>
          {res.facilities.map(f => <div key={f._id} className="card" style={{ marginBottom: 6 }}>{f.name}</div>)}
        </>
      )}
    </>
  );
}
