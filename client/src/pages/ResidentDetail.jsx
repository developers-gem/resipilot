import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { PageHeader } from '../components/ui.jsx';

export default function ResidentDetail() {
  const { id } = useParams();
  const [r, setR] = useState(null);
  const [tab, setTab] = useState('overview');
  useEffect(() => { api.get(`/residents/${id}`).then(setR); }, [id]);
  if (!r) return <div className="muted">Loading…</div>;

  return (
    <>
      <PageHeader title={`${r.firstName} ${r.lastName}`} actions={
        <Link to="/residents" className="btn"><i className="ti ti-arrow-left" /> Back</Link>
      } />
      <div className="card">
        <div className="row" style={{ gap: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--blue-l)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 600 }}>
            {r.firstName[0]}{r.lastName[0]}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{r.firstName} {r.lastName}</div>
            <div style={{ color: 'var(--tx2)' }}>DOB {r.dateOfBirth?.slice(0,10)} • Room {r.roomNumber || '—'}</div>
            <div style={{ marginTop: 6 }}><span className={`badge ${r.riskLevel === 'high' ? 'red' : r.riskLevel === 'medium' ? 'amber' : 'green'}`}>Risk: {r.riskLevel}</span></div>
          </div>
        </div>
      </div>

      <div className="row" style={{ marginTop: 14, borderBottom: '1px solid var(--bdr)' }}>
        {['overview','medications','behavior','appointments','documents'].map(t => (
          <button key={t} className="btn ghost" onClick={() => setTab(t)}
            style={{ borderRadius: 0, borderBottom: tab === t ? '2px solid var(--blue)' : '2px solid transparent', color: tab === t ? 'var(--blue)' : 'var(--tx2)' }}>
            {t}
          </button>
        ))}
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        {tab === 'overview' && <Overview r={r} />}
        {tab === 'medications' && <SubList path={`/medications?resident=${id}`} cols={['name','dosage','frequency']} />}
        {tab === 'behavior' && <SubList path={`/behavioral-incidents?resident=${id}`} cols={['occurredAt','severity','behavior']} />}
        {tab === 'appointments' && <SubList path={`/appointments?resident=${id}`} cols={['scheduledAt','title','status']} />}
        {tab === 'documents' && <SubList path={`/documents?resident=${id}`} cols={['title','category','createdAt']} />}
      </div>
    </>
  );
}

function Overview({ r }) {
  return (
    <div className="grid cols-2">
      <Info label="Preferred name" value={r.preferredName} />
      <Info label="Gender" value={r.gender} />
      <Info label="Admission" value={r.admissionDate?.slice(0,10)} />
      <Info label="Discharge" value={r.dischargeDate?.slice(0,10)} />
      <Info label="Primary diagnosis" value={r.primaryDiagnosis} />
      <Info label="Allergies" value={r.allergies} />
    </div>
  );
}
function Info({ label, value }) {
  return <div><div style={{ fontSize: 11, color: 'var(--tx3)', textTransform: 'uppercase' }}>{label}</div><div>{value || '—'}</div></div>;
}
function SubList({ path, cols }) {
  const [rows, setRows] = useState([]);
  useEffect(() => { api.get(path).then(setRows).catch(() => setRows([])); }, [path]);
  if (!rows.length) return <div className="muted">No records.</div>;
  return (
    <table><thead><tr>{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>{rows.map(r => <tr key={r._id}>{cols.map(c => <td key={c}>{String(r[c] ?? '—').slice(0, 60)}</td>)}</tr>)}</tbody>
    </table>
  );
}
