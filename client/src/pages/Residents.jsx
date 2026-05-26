import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useResource, PageHeader, Modal, Field } from '../components/ui.jsx';

export default function Residents() {
  const { items, create, remove, loading } = useResource('/residents');
  const facilities = useResource('/facilities').items;

  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = items.filter(r =>
    !search ||
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Residents"
        actions={
          <>
            <input
              className="search"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '7px 10px',
                border: '1px solid var(--bdr)',
                borderRadius: 'var(--rad-sm)',
                fontSize: 12.5
              }}
            />

            <button
              className="btn primary"
              onClick={() => setShowAdd(true)}
            >
              <i className="ti ti-plus" /> Add Resident
            </button>
          </>
        }
      />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>DOB</th>
              <th>Risk</th>
              <th>Room</th>
              <th>Facility</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="muted">
                  Loading…
                </td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="muted">
                  No residents yet.
                </td>
              </tr>
            )}

            {filtered.map(r => (
              <tr key={r._id}>
                <td>
                  <Link
                    to={`/residents/${r._id}`}
                    style={{ color: 'var(--blue)' }}
                  >
                    {r.firstName} {r.lastName}
                  </Link>
                </td>

                <td>{r.dateOfBirth?.slice(0, 10)}</td>

                <td>
                  <span
                    className={`badge ${
                      r.riskLevel === 'high'
                        ? 'red'
                        : r.riskLevel === 'moderate'
                        ? 'amber'
                        : 'green'
                    }`}
                  >
                    {r.riskLevel}
                  </span>
                </td>

                <td>{r.roomNumber || '—'}</td>

                <td>
                  {facilities.find(f => f._id === r.facility)?.name || '—'}
                </td>

                <td>
                  {r.isActive ? (
                    <span className="badge green">active</span>
                  ) : (
                    <span className="badge gray">inactive</span>
                  )}
                </td>

                <td>
                  <button
                    className="btn sm ghost"
                    onClick={() => remove(r._id)}
                  >
                    <i className="ti ti-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <AddResidentModal
          facilities={facilities}
          onClose={() => setShowAdd(false)}
          onSave={async d => {
            await create(d);
            setShowAdd(false);
          }}
        />
      )}
    </>
  );
}

function AddResidentModal({ facilities, onSave, onClose }) {
  const [step, setStep] = useState(1);

  const [d, setD] = useState({
    // STEP 1
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Female',
    ethnicity: '',
    primaryLanguage: 'English',
    referringAgency: '',
    referralWorker: '',
    placementReason: '',

    // STEP 2
    facility: facilities[0]?._id || '',
    roomNumber: '',
    placementDate: '',
    placementType: 'Emergency',
    legalStatus: '',
    permanencyGoal: 'Reunification',
    caseNumber: '',
    school: '',

    // STEP 3
    riskLevel: 'moderate',
    diagnoses: '',
    medications: '',
    physician: '',
    psychotropicMedications: 'No',
    allergies: '',
    safetyConcerns: '',
    priorPlacements: '',
    traumaHistory: 'Yes — see case file',

    // STEP 4
    caseworker: '',
    supervisor: '',
    therapist: '',
    casaVolunteer: '',
    guardianName: '',
    guardianPhone: '',
    guardianRestrictions: 'No restrictions — approved contact',
    emergencyContact: '',
    countyWorker: '',
    restrictedIndividuals: '',

    // STATUS
    isActive: true
  });

  const next = () => setStep(prev => Math.min(prev + 1, 5));
  const back = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <Modal
      title={`New resident admission`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>

          {step > 1 && (
            <button className="btn" onClick={back}>
              Back
            </button>
          )}

          {step < 5 ? (
            <button className="btn primary" onClick={next}>
              Next
            </button>
          ) : (
            <button className="btn primary" onClick={() => onSave(d)}>
              Create profile & start intake
            </button>
          )}
        </>
      }
    >
      <div
        style={{
          display: 'flex',
          gap: 20,
          marginBottom: 24,
          fontSize: 13,
          fontWeight: 600
          
        }}
      >
        <span className={step >= 1 ? 'text-blue' : ''}>1 · Basic info</span>
        <span className={step >= 2 ? 'text-blue' : ''}>2 · Placement</span>
        <span className={step >= 3 ? 'text-blue' : ''}>3 · Risk & health</span>
        <span className={step >= 4 ? 'text-blue' : ''}>4 · Team & contacts</span>
        <span className={step >= 5 ? 'text-blue' : ''}>5 · Review</span>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <div className="grid cols-2">
            <Field label="First name">
              <input
                value={d.firstName}
                onChange={e =>
                  setD({ ...d, firstName: e.target.value })
                }
              />
            </Field>

            <Field label="Last name">
              <input
                value={d.lastName}
                onChange={e =>
                  setD({ ...d, lastName: e.target.value })
                }
              />
            </Field>
          </div>
<Field label="Preferred name">
  <input
    value={d.preferredName}
    onChange={e =>
      setD({ ...d, preferredName: e.target.value })
    }
  />
</Field>
<Field label="Pronouns">
  <input
    value={d.pronouns}
    onChange={e =>
      setD({ ...d, pronouns: e.target.value })
    }
  />
</Field>
          <div className="grid cols-2">
            <Field label="Date of birth">
              <input
                type="date"
                value={d.dateOfBirth}
                onChange={e =>
                  setD({ ...d, dateOfBirth: e.target.value })
                }
              />
            </Field>

            <Field label="Gender">
              <select
                value={d.gender}
                onChange={e =>
                  setD({ ...d, gender: e.target.value })
                }
              >
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </Field>
          </div>

          <div className="grid cols-2">
            <Field label="Ethnicity">
              <input
                value={d.ethnicity}
                onChange={e =>
                  setD({ ...d, ethnicity: e.target.value })
                }
              />
            </Field>

            <Field label="Primary language">
              <input
                value={d.primaryLanguage}
                onChange={e =>
                  setD({ ...d, primaryLanguage: e.target.value })
                }
              />
            </Field>
          </div>

          <div className="grid cols-2">
            <Field label="Referring agency">
              <input
                value={d.referringAgency}
                onChange={e =>
                  setD({ ...d, referringAgency: e.target.value })
                }
              />
            </Field>

            <Field label="Referral worker">
              <input
                value={d.referralWorker}
                onChange={e =>
                  setD({ ...d, referralWorker: e.target.value })
                }
              />
            </Field>
          </div>

          <Field label="Reason for placement">
            <textarea
              rows="4"
              value={d.placementReason}
              onChange={e =>
                setD({ ...d, placementReason: e.target.value })
              }
            />
          </Field>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <div className="grid cols-2">
            <Field label="Facility">
              <select
                value={d.facility}
                onChange={e =>
                  setD({ ...d, facility: e.target.value })
                }
              >
                {facilities.map(f => (
                  <option key={f._id} value={f._id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Room / bed">
              <input
                value={d.roomNumber}
                onChange={e =>
                  setD({ ...d, roomNumber: e.target.value })
                }
              />
            </Field>
          </div>

          <div className="grid cols-2">
            <Field label="Placement date">
              <input
                type="date"
                value={d.placementDate}
                onChange={e =>
                  setD({ ...d, placementDate: e.target.value })
                }
              />
            </Field>

            <Field label="Placement type">
              <select
                value={d.placementType}
                onChange={e =>
                  setD({ ...d, placementType: e.target.value })
                }
              >
                <option>Emergency</option>
                <option>Standard</option>
                <option>Temporary</option>
              </select>
            </Field>
          </div>

          <div className="grid cols-2">
            <Field label="Legal status">
              <input
                value={d.legalStatus}
                onChange={e =>
                  setD({ ...d, legalStatus: e.target.value })
                }
              />
            </Field>

            <Field label="Permanency goal">
              <select
                value={d.permanencyGoal}
                onChange={e =>
                  setD({ ...d, permanencyGoal: e.target.value })
                }
              >
                <option>Reunification</option>
                <option>Adoption</option>
                <option>Guardianship</option>
                <option>PPLA</option>
                <option>APPLA</option>
              </select>
            </Field>
          </div>

          <div className="grid cols-2">
            <Field label="Case number">
              <input
                value={d.caseNumber}
                onChange={e =>
                  setD({ ...d, caseNumber: e.target.value })
                }
              />
            </Field>

            <Field label="School">
              <input
                value={d.school}
                onChange={e =>
                  setD({ ...d, school: e.target.value })
                }
              />
            </Field>
          </div>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <Field label="Risk level">
            <select
              value={d.riskLevel}
              onChange={e =>
                setD({ ...d, riskLevel: e.target.value })
              }
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </Field>

          <div className="grid cols-2">
            <Field label="Known diagnoses">
              <input
                value={d.diagnoses}
                onChange={e =>
                  setD({ ...d, diagnoses: e.target.value })
                }
              />
            </Field>

            <Field label="Current medications">
              <input
                value={d.medications}
                onChange={e =>
                  setD({ ...d, medications: e.target.value })
                }
              />
            </Field>
          </div>

          <Field label="Prescribing physician / psychiatrist">
            <input
              value={d.physician}
              onChange={e =>
                setD({ ...d, physician: e.target.value })
              }
            />
          </Field>

          <div className="grid cols-2">
            <Field label="Psychotropic medications?">
              <select
                value={d.psychotropicMedications}
                onChange={e =>
                  setD({
                    ...d,
                    psychotropicMedications: e.target.value
                  })
                }
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </Field>

            <Field label="Medical allergies">
              <input
                value={d.allergies}
                onChange={e =>
                  setD({ ...d, allergies: e.target.value })
                }
              />
            </Field>
          </div>

          <Field label="Known behavioral triggers / safety concerns">
            <textarea
              rows="4"
              value={d.safetyConcerns}
              onChange={e =>
                setD({ ...d, safetyConcerns: e.target.value })
              }
            />
          </Field>

          <div className="grid cols-2">
            <Field label="Prior placements">
              <input
                value={d.priorPlacements}
                onChange={e =>
                  setD({ ...d, priorPlacements: e.target.value })
                }
              />
            </Field>

            <Field label="Trauma history noted">
              <select
                value={d.traumaHistory}
                onChange={e =>
                  setD({ ...d, traumaHistory: e.target.value })
                }
              >
                <option>Yes — see case file</option>
                <option>No</option>
              </select>
            </Field>
          </div>
        </>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <>
          <div className="grid cols-2">
            <Field label="Assigned caseworker">
              <input
                value={d.caseworker}
                onChange={e =>
                  setD({ ...d, caseworker: e.target.value })
                }
              />
            </Field>

            <Field label="Supervising supervisor">
              <input
                value={d.supervisor}
                onChange={e =>
                  setD({ ...d, supervisor: e.target.value })
                }
              />
            </Field>
          </div>

          <div className="grid cols-2">
            <Field label="Therapist / counselor">
              <input
                value={d.therapist}
                onChange={e =>
                  setD({ ...d, therapist: e.target.value })
                }
              />
            </Field>

            <Field label="CASA volunteer">
              <input
                value={d.casaVolunteer}
                onChange={e =>
                  setD({ ...d, casaVolunteer: e.target.value })
                }
              />
            </Field>
          </div>

          <div className="grid cols-2">
            <Field label="Primary guardian name">
              <input
                value={d.guardianName}
                onChange={e =>
                  setD({ ...d, guardianName: e.target.value })
                }
              />
            </Field>

            <Field label="Guardian phone">
              <input
                value={d.guardianPhone}
                onChange={e =>
                  setD({ ...d, guardianPhone: e.target.value })
                }
              />
            </Field>
          </div>

          <Field label="Guardian contact restrictions">
            <select
              value={d.guardianRestrictions}
              onChange={e =>
                setD({
                  ...d,
                  guardianRestrictions: e.target.value
                })
              }
            >
              <option>No restrictions — approved contact</option>
              <option>Supervised only</option>
              <option>No contact</option>
            </select>
          </Field>

          <div className="grid cols-2">
            <Field label="Emergency contact #2">
              <input
                value={d.emergencyContact}
                onChange={e =>
                  setD({ ...d, emergencyContact: e.target.value })
                }
              />
            </Field>

            <Field label="On-call county worker">
              <input
                value={d.countyWorker}
                onChange={e =>
                  setD({ ...d, countyWorker: e.target.value })
                }
              />
            </Field>
          </div>

          <Field label="Restricted individuals">
            <textarea
              rows="3"
              value={d.restrictedIndividuals}
              onChange={e =>
                setD({
                  ...d,
                  restrictedIndividuals: e.target.value
                })
              }
            />
          </Field>
        </>
      )}

      {/* STEP 5 */}
      {step === 5 && (
        <div className="review-box">
          <div className="grid cols-2">
            <div className="card">
              <h4>Basic Information</h4>
              <p>
                <strong>Name:</strong> {d.firstName} {d.lastName}
              </p>
              <p>
                <strong>DOB:</strong> {d.dateOfBirth}
              </p>
              <p>
                <strong>Language:</strong> {d.primaryLanguage}
              </p>
              <p>
                <strong>Agency:</strong> {d.referringAgency}
              </p>
            </div>

            <div className="card">
              <h4>Placement</h4>
              <p>
                <strong>Facility:</strong>{' '}
                {facilities.find(f => f._id === d.facility)?.name}
              </p>
              <p>
                <strong>Room:</strong> {d.roomNumber}
              </p>
              <p>
                <strong>Type:</strong> {d.placementType}
              </p>
              <p>
                <strong>Legal status:</strong> {d.legalStatus}
              </p>
            </div>
          </div>

          <div className="grid cols-2" style={{ marginTop: 16 }}>
            <div className="card">
              <h4>Risk & Health</h4>
              <p>
                <strong>Risk level:</strong> {d.riskLevel}
              </p>
              <p>
                <strong>Diagnoses:</strong> {d.diagnoses || '—'}
              </p>
              <p>
                <strong>Medications:</strong> {d.medications || '—'}
              </p>
            </div>

            <div className="card">
              <h4>Team</h4>
              <p>
                <strong>Caseworker:</strong> {d.caseworker || '—'}
              </p>
              <p>
                <strong>Guardian:</strong> {d.guardianName || '—'}
              </p>
              <p>
                <strong>Restrictions:</strong>{' '}
                {d.guardianRestrictions}
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}