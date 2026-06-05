import { useState } from 'react';
import { useResource, PageHeader, Modal, Field } from '../components/ui.jsx';

export default function Mar() {
  const [marAction, setMarAction] = useState(null);
  const [marNote, setMarNote] = useState('');
  const meds = useResource('/medications');
  const entries = useResource('/mar');
  const residents = useResource('/residents').items;
  const [showMed, setShowMed] = useState(false);
  const [selectedMedication, setSelectedMedication] =
    useState(null);

  return (
    <>
      <PageHeader title="MAR — Medications" actions={
        <button
          className="btn primary"
          onClick={() => setShowMed(true)}
        >
          <i className="ti ti-plus" />
          Add medication
        </button>
      } />



      {/* DASHBOARD CARDS */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit,minmax(180px,1fr))',
          gap: 14,
          marginBottom: 24
        }}
      >
        <div className="card">
          <div className="muted">
            Active Medications
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700
            }}
          >
            {meds.items.length}
          </div>
        </div>

        <div className="card">
          <div className="muted">
            Given Today
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700
            }}
          >
            {
              entries.items.filter(
                e => e.status === 'given'
              ).length
            }
          </div>
        </div>

        <div className="card">
          <div className="muted">
            Refused
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700
            }}
          >
            {
              entries.items.filter(
                e => e.status === 'refused'
              ).length
            }
          </div>
        </div>

        <div className="card">
          <div className="muted">
            Other
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700
            }}
          >
            {
              entries.items.filter(
                e => e.status === 'other'
              ).length
            }
          </div>
        </div>
      </div>

      <h3 className="section-title">
        Active medications
      </h3>


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
                        <div
                          style={{
                            marginTop: 4,
                            color: 'var(--tx3)',
                            fontSize: 13
                          }}
                        >
                          Route: {m.route || '—'}
                        </div>

                        <div
                          style={{
                            color: 'var(--tx3)',
                            fontSize: 13
                          }}
                        >
                          Prescriber: {m.prescriber || '—'}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        gap: 8
                      }}
                    >
                      <button
                        className="btn sm"
                        onClick={() =>
                          setSelectedMedication(m)
                        }
                      >
                        <i className="ti ti-eye" />
                      </button>

                      <button
                        className="btn sm ghost"
                        onClick={() => meds.remove(m._id)}
                      >
                        <i className="ti ti-trash" />
                      </button>
                    </div>
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
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                    padding: 14,
                    background: '#fafafa'
                  }}
                >
                  <button
                    className="btn"
                    style={{
                      background: '#16a34a',
                      color: '#fff',
                      border: 'none'
                    }}
                    onClick={async () => {
                      await entries.create({
                        medication: m._id,
                        resident: m.resident,
                        scheduledAt: new Date(),
                        administeredAt: new Date(),
                        status: 'given',
                        note: ''
                      });

                      entries.refresh();
                    }}
                  >
                    ✓ Given
                  </button>

                  <button
                    className="btn"
                    style={{
                      background: '#dc2626',
                      color: '#fff',
                      border: 'none'
                    }}
                    onClick={() =>
                      setMarAction({
                        medication: m,
                        status: 'refused'
                      })
                    }
                  >
                    ✕ Refused
                  </button>

                  <button
                    className="btn"
                    style={{
                      background: '#f59e0b',
                      color: '#fff',
                      border: 'none'
                    }}
                    onClick={() =>
                      setMarAction({
                        medication: m,
                        status: 'other'
                      })
                    }
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
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr>
                <th>Resident</th>

<th>Scheduled</th><th>Status</th><th>Note</th></tr></thead>
          <tbody>
            {entries.items.length === 0 && <tr><td colSpan="4" className="muted">No MAR entries.</td></tr>}
            {entries.items.slice(0, 30).map(e => (
              <tr key={e._id}>

                <td>
    {(() => {
      const resident = residents.find(
        r => r._id === e.resident
      );

      return resident
        ? `${resident.firstName} ${resident.lastName}`
        : '—';
    })()}
  </td>
                
                <td>{new Date(e.scheduledAt).toLocaleString()}</td>
                <td>
                  <span
                    className={`badge ${e.status === 'given'
                      ? 'green'
                      : e.status === 'refused'
                        ? 'red'
                        : e.status === 'other'
                          ? 'amber'
                          : e.status === 'missed'
                            ? 'red'
                            : 'gray'
                      }`}
                  >                    {e.status}
                  </span></td>
                <td>{e.note || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showMed && <AddMed residents={residents} onClose={() => setShowMed(false)} onSave={async d => { await meds.create(d); setShowMed(false); }} />}


      {marAction && (
        <Modal
          title="Medication Administration"
          onClose={() => {
            setMarAction(null);
            setMarNote('');
          }}
          footer={
            <>
              <button
                className="btn"
                onClick={() => {
                  setMarAction(null);
                  setMarNote('');
                }}
              >
                Cancel
              </button>

              <button
                className="btn primary"
                onClick={async () => {
                  await entries.create({
                    medication:
                      marAction.medication._id,
                    resident:
                      marAction.medication
                        .resident,
                    scheduledAt:
                      new Date(),
                    administeredAt:
                      new Date(),
                    status:
                      marAction.status,
                    note: marNote
                  });

                  entries.refresh();

                  setMarAction(null);
                  setMarNote('');
                }}
              >
                Save
              </button>
            </>
          }
        >
          <Field label="Status">
            <input
              value={marAction.status}
              disabled
            />
          </Field>

          <Field label="Note">
            <textarea
              rows="4"
              value={marNote}
              onChange={e =>
                setMarNote(
                  e.target.value
                )
              }
            />
          </Field>
        </Modal>

      )}










      {selectedMedication && (
        <Modal
          title="Medication Details"
          onClose={() =>
            setSelectedMedication(null)
          }
          footer={
            <button
              className="btn primary"
              onClick={() =>
                setSelectedMedication(null)
              }
            >
              Close
            </button>
          }
        >
          <div
            style={{
              display: 'grid',
              gap: 12
            }}
          >
            <div>
              <strong>Name</strong>
              <div>
                {selectedMedication.name}
              </div>
            </div>

            <div>
              <strong>Dosage</strong>
              <div>
                {selectedMedication.dosage}
              </div>
            </div>

            <div>
              <strong>Frequency</strong>
              <div>
                {selectedMedication.frequency}
              </div>
            </div>

            <div>
              <strong>Route</strong>
              <div>
                {selectedMedication.route || '—'}
              </div>
            </div>

            <div>
              <strong>Prescriber</strong>
              <div>
                {selectedMedication.prescriber || '—'}
              </div>
            </div>

            <div>
              <strong>Notes</strong>
              <div>
                {selectedMedication.notes || '—'}
              </div>
            </div>

            <div>
              <strong>PRN</strong>
              <div>
                {selectedMedication.isPrn
                  ? 'Yes'
                  : 'No'}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
function AddMed({ residents, onSave, onClose }) {
  const [d, setD] = useState(
    { resident: residents[0]?._id || '', name: '', dosage: '', frequency: 'BID', isPrn: false });
  return (
    <Modal title="Add medication" onClose={onClose} footer={
      <><button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" onClick={() => onSave(d)}>Save</button></>
    }>
      <Field label="Resident"><select value={d.resident} onChange={e => setD({ ...d, resident: e.target.value })}>
        {residents.map(r => <option key={r._id} value={r._id}>{r.firstName} {r.lastName}</option>)}
      </select></Field>
<Field label="Medication Name">
  <input
    value={d.name}
    onChange={e =>
      setD({
        ...d,
        name: e.target.value
      })
    }
    placeholder="e.g. Tylenol, Ibuprofen, Amoxicillin"
  />
</Field>
      <div className="grid cols-2">
        <Field label="Dosage"><input value={d.dosage} onChange={e => setD({ ...d, dosage: e.target.value })} placeholder="e.g. 10mg" /></Field>
<Field label="Administration Frequency">
  <select
    value={d.frequency}
    onChange={e =>
      setD({
        ...d,
        frequency: e.target.value
      })
    }
  >
    <option value="">
      Select Frequency
    </option>

    <option value="QD">
      Once Daily (QD)
    </option>

    <option value="BID">
      Twice Daily (BID)
    </option>

    <option value="TID">
      Three Times Daily (TID)
    </option>

    <option value="QID">
      Four Times Daily (QID)
    </option>

    <option value="QHS">
      At Bedtime (QHS)
    </option>

    <option value="PRN">
      As Needed (PRN)
    </option>

    <option value="Weekly">
      Weekly
    </option>

    <option value="Monthly">
      Monthly
    </option>
  </select>
</Field>
      </div>
      <Field label="Route">
  <select
    value={d.route}
    onChange={e =>
      setD({
        ...d,
        route: e.target.value
      })
    }
  >
    <option value="">
      Select Route
    </option>
    <option value="Oral">
      Oral
    </option>
    <option value="Topical">
      Topical
    </option>
    <option value="Injection">
      Injection
    </option>
    <option value="Inhalation">
      Inhalation
    </option>
    <option value="Eye Drops">
      Eye Drops
    </option>
  </select>
</Field>

<Field label="Prescriber">
  <input
    value={d.prescriber}
    onChange={e =>
      setD({
        ...d,
        prescriber: e.target.value
      })
    }
    placeholder="Dr. Patel"
  />
</Field>
<Field label="Start Date">
  <input
    type="date"
    value={d.startDate}
    onChange={e =>
      setD({
        ...d,
        startDate: e.target.value
      })
    }
  />
</Field>
<Field label="End Date">
  <input
    type="date"
    value={d.endDate}
    onChange={e =>
      setD({
        ...d,
        endDate: e.target.value
      })
    }
  />
</Field>
<Field label="Notes">
  <textarea
    rows="3"
    value={d.notes}
    onChange={e =>
      setD({
        ...d,
        notes: e.target.value
      })
    }
  />
</Field>
      <label className="row"><input type="checkbox" checked={d.isPrn} onChange={e => setD({ ...d, isPrn: e.target.checked })} /> PRN (as-needed)</label>
    </Modal>
  );
}
