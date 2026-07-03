import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi as api } from '../lib/adminApi.js';
import { PageHeader } from '../components/ui.jsx';

export default function ResidentDetail() {
  const { id } = useParams();
  const [r, setR] = useState(null);
  const [tab, setTab] = useState('overview');
  const [facility, setFacility] = useState(null);

  useEffect(() => {
    if (r?.facility) {
      api.get(`/facilities/${r.facility}`)
        .then(setFacility);
    }
  }, [r]);

  useEffect(() => { api.get(`/residents/${id}`).then(setR); }, [id]);
  if (!r) return <div className="muted">Loading…</div>;

  return (
    <>
      {/* HEADER */}
      <div
        style={{
          marginBottom: 18
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: 18
          }}
        >
          <div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 700,
                marginBottom: 8
              }}
            >
              {r.firstName} {r.lastName}
            </div>

            <div
              style={{
                color: 'var(--tx3)',
                fontSize: 16
              }}
            >
              RES-{r._id?.slice(-6)} · Age{' '}
              {new Date().getFullYear() -
                new Date(r.dateOfBirth).getFullYear()}
              · Room {r.roomNumber || '—'}
            </div>
          </div>

          <Link
            to="/residents"
            className="btn"
          >
            <i className="ti ti-arrow-left" /> Back
          </Link>
        </div>

        {/* STATUS BADGES */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap'
          }}
        >
          <span
            className={`badge ${r.riskLevel === 'high'
                ? 'red'
                : r.riskLevel === 'moderate'
                  ? 'amber'
                  : 'green'
              }`}
          >
            {r.riskLevel} risk
          </span>

          <span className="badge red">
            2 open follow-ups
          </span>

          <span className="badge green">
            BIP v3.2
          </span>

          <span className="badge blue">
            Court: May 27
          </span>

          <span className="badge green">
            27d incident-free
          </span>
        </div>
      </div>

      {/* TABS */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          borderBottom:
            '1px solid var(--bdr)',
          marginBottom: 20,
          overflowX: 'auto'
        }}
      >
        {[
          'overview',
          'behavior',
          'medications',
          'appointments',
          'documents'
        ].map(t => (
          <button
            key={t}
            className="btn ghost"
            onClick={() => setTab(t)}
            style={{
              borderRadius: 0,
              padding:
                '14px 18px',
              borderBottom:
                tab === t
                  ? '2px solid var(--blue)'
                  : '2px solid transparent',
              color:
                tab === t
                  ? 'var(--blue)'
                  : 'var(--tx2)',
              fontWeight:
                tab === t ? 600 : 500
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: 20
            }}
          >
            {/* LEFT */}
            <div className="card">
              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  marginBottom: 20
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700
                  }}
                >
                  Overview
                </div>

                <span className="badge green">
                  Active
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '1fr 1fr',
                  gap: 18
                }}
              >
                <Info
                  label="Preferred name"
                  value={r.preferredName}
                />

                <Info
                  label="Gender"
                  value={r.gender}
                />

                <Info
                  label="Admission"
                  value={r.admissionDate?.slice(
                    0,
                    10
                  )}
                />

                <Info
                  label="Discharge"
                  value={r.dischargeDate?.slice(
                    0,
                    10
                  )}
                />

                <Info
                  label="Diagnosis"
                  value={
                    r.primaryDiagnosis
                  }
                />

                <Info
                  label="Allergies"
                  value={r.allergies}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="card">
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  marginBottom: 20
                }}
              >
                Placement
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection:
                    'column',
                  gap: 18
                }}
              >
                <Info
                  label="Facility"
                  value={facility?.name} />

                <Info
                  label="Room"
                  value={r.roomNumber}
                />

                <Info
                  label="Risk level"
                  value={r.riskLevel}
                />

                <Info
                  label="Status"
                  value={
                    r.isActive
                      ? 'Active'
                      : 'Inactive'
                  }
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* MEDICATIONS */}
      {tab === 'medications' && (
        <ResidentMedications residentId={id} />
      )}

      {/* BEHAVIOR */}
      {tab === 'behavior' && (
        <SubList
          path={`/behavioral-incidents?resident=${id}`}
          cols={[
            'occurredAt',
            'severity',
            'behavior'
          ]}
        />
      )}

      {/* APPOINTMENTS */}
      {tab === 'appointments' && (
        <SubList
          path={`/appointments?resident=${id}`}
          cols={[
            'scheduledAt',
            'title',
            'status'
          ]}
        />
      )}

      {/* DOCUMENTS */}
      {tab === 'documents' && (
        <SubList
          path={`/documents?resident=${id}`}
          cols={[
            'title',
            'category',
            'createdAt'
          ]}
        />
      )}
    </>
  );
}

function Overview({ r }) {
  return (
    <div className="grid cols-2">
      <Info label="Preferred name" value={r.preferredName} />
      <Info label="Gender" value={r.gender} />
      <Info label="Admission" value={r.admissionDate?.slice(0, 10)} />
      <Info label="Discharge" value={r.dischargeDate?.slice(0, 10)} />
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


function ResidentMedications({ residentId }) {
  const [meds, setMeds] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    api.get(`/medications?resident=${residentId}`)
      .then(setMeds);

    api.get(`/mar?resident=${residentId}`)
      .then(setEntries);
  }, [residentId]);

  return (
    <div style={{ display: 'grid', gap: 20 }}>

      {/* ACTIVE MEDICATIONS */}
      <div className="card">
        <div
          className="row"
          style={{
            justifyContent: 'space-between',
            marginBottom: 16
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            Active medications
          </div>

          <Link to="/mar" className="btn primary sm">
            <i className="ti ti-notebook" />
            Log MAR
          </Link>
        </div>

        <table>
          <thead>
            <tr>
              <th>Medication</th>
              <th>Dose</th>
              <th>Schedule</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {meds.length === 0 && (
              <tr>
                <td colSpan="4" className="muted">
                  No medications.
                </td>
              </tr>
            )}

            {meds.map(m => (
              <tr key={m._id}>
                <td>{m.name}</td>
                <td>{m.dosage}</td>
                <td>{m.frequency}</td>

                <td>
                  <span className="badge green">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MAR LOG */}
      <div className="card">
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 16
          }}
        >
          MAR log — today
        </div>

        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Status</th>
              <th>Note</th>
            </tr>
          </thead>

          <tbody>
            {entries.length === 0 && (
              <tr>
                <td colSpan="3" className="muted">
                  No MAR entries.
                </td>
              </tr>
            )}

            {entries.map(e => (
              <tr key={e._id}>
                <td>
                  {new Date(e.scheduledAt).toLocaleTimeString()}
                </td>

                <td>
                  <span
                    className={`badge ${e.status === 'given'
                        ? 'green'
                        : e.status === 'missed'
                          ? 'red'
                          : 'gray'
                      }`}
                  >
                    {e.status}
                  </span>
                </td>

                <td>{e.note || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}