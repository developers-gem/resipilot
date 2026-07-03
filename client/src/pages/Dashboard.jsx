import { useEffect, useState } from 'react';
import { adminApi as api } from '../lib/adminApi.js';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [s, setS] = useState({});
  useEffect(() => {
    Promise.all([
      api.get('/residents').catch(() => []),
      api.get('/facilities').catch(() => []),
      api.get('/staff').catch(() => []),
      api.get('/appointments').catch(() => []),
      api.get('/behavioral-incidents').catch(() => []),
      api.get('/mar').catch(() => []),
      api.get('/tasks').catch(() => []),
    ]).then(([res, fac, st, ap, bi, mar, tk]) => setS({
      residents: res.length, facilities: fac.length, staff: st.length,
      appointments: ap.length, incidents: bi.length, marToday: mar.length, tasks: tk.length,
      recentIncidents: bi.slice(0, 5), upcomingAppts: ap.slice(0, 5),
    }));
  }, []);

  return (
    <>
      <div className="grid cols-4">
        <Stat label="Residents"      value={s.residents}    icon="ti-users"       link="/residents" />
        <Stat label="Facilities"     value={s.facilities}   icon="ti-building"    link="/facilities" />
        <Stat label="Staff"          value={s.staff}        icon="ti-id-badge"    link="/staff" />
        <Stat label="Open Tasks"     value={s.tasks}        icon="ti-checklist"   link="/workload" />
        <Stat label="MAR Entries"    value={s.marToday}     icon="ti-pill"        link="/mar" />
        <Stat label="Appointments"   value={s.appointments} icon="ti-calendar"    link="/appointments" />
        <Stat label="Behav. Incidents" value={s.incidents}  icon="ti-mood-confuzed" link="/behavioral" />
        <Stat label="Quick Search"   value="↗"              icon="ti-search"      link="/search" />
      </div>

      <div className="grid cols-2" style={{ marginTop: 18 }}>
        <div className="card">
          <h3>Recent behavioral incidents</h3>
          {(s.recentIncidents || []).length === 0
            ? <div className="muted" style={{ padding: 20 }}>None recorded.</div>
            : (s.recentIncidents || []).map((i, idx) => (
                <div key={idx} className="row" style={{ padding: '8px 0', borderTop: idx ? '1px solid var(--bdr)' : 0 }}>
                  <span className="badge red">SEV {i.severity}</span>
                  <span style={{ flex: 1 }}>{i.behavior?.slice(0, 60)}</span>
                  <span style={{ color: 'var(--tx3)', fontSize: 11 }}>{new Date(i.occurredAt).toLocaleString()}</span>
                </div>
              ))}
        </div>
        <div className="card">
          <h3>Upcoming appointments</h3>
          {(s.upcomingAppts || []).length === 0
            ? <div className="muted" style={{ padding: 20 }}>None scheduled.</div>
            : (s.upcomingAppts || []).map((a, idx) => (
                <div key={idx} className="row" style={{ padding: '8px 0', borderTop: idx ? '1px solid var(--bdr)' : 0 }}>
                  <span className="badge blue">{a.apptType || 'visit'}</span>
                  <span style={{ flex: 1 }}>{a.title}</span>
                  <span style={{ color: 'var(--tx3)', fontSize: 11 }}>{new Date(a.scheduledAt).toLocaleString()}</span>
                </div>
              ))}
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, icon, link }) {
  const inner = (
    <div className="stat">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="label">{label}</span>
        <i className={`ti ${icon}`} style={{ color: 'var(--blue)' }} />
      </div>
      <div className="value">{value ?? '—'}</div>
    </div>
  );
  return link ? <Link to={link}>{inner}</Link> : inner;
}
