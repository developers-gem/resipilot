import { useState } from 'react';
import { useResource, PageHeader, Modal, Field } from '../components/ui.jsx';

export default function Incidents() {
  const { items, create, remove } = useResource('/incident-reports');
  const [show, setShow] = useState(false);
  const residents = useResource('/residents').items;
  const [selectedIncident, setSelectedIncident] = useState(null);



  const selectedResident =
    selectedIncident
      ? residents.find(
        r => r._id === selectedIncident.resident
      )
      : null;


  return (
    <>
    <PageHeader
  title="Incident Reports (IRR / CDSS)"
  actions={
    <button
      className="btn primary"
      onClick={() => setShow(true)}
    >
      <i className="ti ti-plus" /> File Report
    </button>
  }
/>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Incident Date</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>            </tr>
          </thead>          <tbody>
            {items.length === 0 && <tr><td colSpan="6" className="muted">No reports.</td></tr>}
            {items.map(i => (
              <tr key={i._id}>
                <td>

                  {(() => {
                    const resident = residents.find(
                      r => r._id === i.resident
                    );

                    return resident
                      ? `${resident.firstName} ${resident.lastName}`
                      : '—';
                  })()}

                </td>

                <td>
                  {i.incidentDate?.slice(0, 10) || '—'}
                </td>

                <td>
                  <span
                    className={`badge ${+i.severity >= 5
                      ? 'red'
                      : +i.severity >= 4
                        ? 'red'
                        : +i.severity >= 3
                          ? 'amber'
                          : 'gray'
                      }`}
                  >
                    {i.severity}
                  </span>
                </td>

                <td>
                <span
  className={`badge ${
    i.status === 'submitted'
      ? 'green'
      : i.status === 'under_review'
      ? 'amber'
      : i.status === 'closed'
      ? 'gray'
      : 'red'
  }`}
>
                    {i.status}
                  </span>
                </td>

                <td>
                  {i.description?.slice(0, 80)}
                </td>

                <td>
                  <div className="row" style={{ gap: 8 }}>
                    <button
                      className="btn sm"
                      onClick={() =>
                        setSelectedIncident(i)
                      }
                    >
                      <i className="ti ti-eye" /> View
                    </button>

                    <button
                      className="btn sm ghost"
                      onClick={() => remove(i._id)}
                    >
                      <i className="ti ti-trash" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {show && (
        <NewIRR
          residents={residents}
          onClose={() => setShow(false)}
          onSave={async d => {
            await create({
              ...d,
              filedAt: new Date()
            });

            setShow(false);
          }}
        />
      )}


      {selectedIncident && (
        <Modal
          title="Incident Report Details"
          onClose={() =>
            setSelectedIncident(null)
          }
          footer={
            <button
              className="btn primary"
              onClick={() =>
                setSelectedIncident(null)
              }
            >
              Close
            </button>
          }
        >
          <div
            style={{
             display: 'grid',
gridTemplateColumns: '1fr 1fr',
gap: 16
            }}
          >
            <div>
              <strong>Resident</strong>
              <div>
                {selectedResident
                  ? `${selectedResident.firstName} ${selectedResident.lastName}`
                  : '—'}
              </div>
            </div>

            <div>
              <strong>Incident Date</strong>
              <div>
                {selectedIncident.incidentDate ||
                  '—'}
              </div>
            </div>

            <div>
  <strong>Time</strong>
  <div>
    {selectedIncident.incidentTime || '—'}
  </div>
</div>


            <div>
              <strong>Severity</strong>
              <div>
                {selectedIncident.severity}
              </div>
            </div>

            <div>
              <strong>Location</strong>
              <div>
                {selectedIncident.location ||
                  '—'}
              </div>
            </div>

            <div>
              <strong>Description</strong>
              <div>
                {selectedIncident.description ||
                  '—'}
              </div>
            </div>

            <div>
              <strong>
                Immediate Actions Taken
              </strong>
              <div>
                {selectedIncident.immediateActions ||
                  '—'}
              </div>
            </div>

            <div>
              <strong>
                Staff E-Signature
              </strong>
              <div>
                {selectedIncident.staffESignature ||
                  '—'}
              </div>
            </div>

            <div>
              <strong>Status</strong>
              <div>
                {selectedIncident.status}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function NewIRR({ residents, onSave, onClose }) {

  const [d, setD] = useState({
    resident: '',
incidentDate: new Date()
  .toISOString()
  .split('T')[0],    incidentTime: '',
    severity: '3',
    location: '',
    description: '',
    immediateActions: '',
    staffESignature: '',
    status: 'submitted'
  });




  return (
    <Modal title="File incident report" onClose={onClose} footer={
      <><button className="btn" onClick={onClose}>Cancel</button>
<button
  className="btn primary"
  onClick={() => {
    if (
      !d.resident ||
      !d.incidentDate ||
      !d.description ||
      !d.location ||
      !d.staffESignature
    ) {
      alert('Please fill all required fields.');
      return;
    }

    onSave(d);
  }}
>
  File Report
</button></>
    }>
      <Field label="Resident *">
        <select
          value={d.resident}
          onChange={e =>
            setD({
              ...d,
              resident: e.target.value
            })
          }
        >
          <option value="">
            Select Resident
          </option>

          {residents.map(r => (
            <option
              key={r._id}
              value={r._id}
            >
              {r.firstName} {r.lastName}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid cols-2">
        <Field label="Incident Date *">
          <input
            type="date"
            value={d.incidentDate}
            onChange={e =>
              setD({
                ...d,
                incidentDate:
                  e.target.value
              })
            }
          />
        </Field>

        <Field label="Time">
          <input
            type="time"
            value={d.incidentTime}
            onChange={e =>
              setD({
                ...d,
                incidentTime:
                  e.target.value
              })
            }
          />
        </Field>
      </div>
      <div className="grid cols-2">
        <Field label="Severity *">
          <select
            value={d.severity}
            onChange={e =>
              setD({
                ...d,
                severity:
                  e.target.value
              })
            }
          >
            <option value="1">
              1 - Minor
            </option>

            <option value="2">
              2 - Low
            </option>

            <option value="3">
              3 - Moderate
            </option>

            <option value="4">
              4 - Serious
            </option>

            <option value="5">
              5 - Critical
            </option>
          </select>
        </Field>

<Field label="Location *">
            <input
            value={d.location}
            onChange={e =>
              setD({
                ...d,
                location:
                  e.target.value
              })
            }
          />
        </Field>
      </div>
      <Field label="Incident Description *">
        <textarea
          rows="4"
          value={d.description}
          onChange={e =>
            setD({
              ...d,
              description:
                e.target.value
            })
          }
        />
      </Field>

      <Field label="Immediate Actions Taken">
        <textarea
          rows="3"
          value={d.immediateActions}
          onChange={e =>
            setD({
              ...d,
              immediateActions:
                e.target.value
            })
          }
        />
      </Field>

<Field label="Staff E-Signature *">        <input
          value={d.staffESignature}
          onChange={e =>
            setD({
              ...d,
              staffESignature:
                e.target.value
            })
          }
        />
      </Field>

    </Modal>
  );
}
