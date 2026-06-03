import { useState } from 'react';
import {
  useResource,
  PageHeader,
  Modal,
  Field
} from '../components/ui.jsx';

export default function Appointments() {
  const { items, create, remove } = useResource('/appointments');
  const residents = useResource('/residents').items;

  const [show, setShow] = useState(false);

  return (
    <>
      <PageHeader
        title="Appointments"
        actions={
          <button
            className="btn primary"
            onClick={() => setShow(true)}
          >
            <i className="ti ti-plus" /> Schedule
          </button>
        }
      />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>When</th>
              <th>Resident</th>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan="6" className="muted">
                  No appointments.
                </td>
              </tr>
            )}

            {items.map(a => (
              <tr key={a._id}>
                <td>
                  {new Date(
                    a.scheduledAt
                  ).toLocaleString()}
                </td>

               <td>
  {a.resident
    ? `${a.resident.firstName} ${a.resident.lastName}`
    : '—'}
</td>

                <td>{a.title}</td>

                <td>
                  <span className="badge blue">
                    {a.apptType || 'visit'}
                  </span>
                </td>

               <td>
  <span
    className={`badge ${
      a.status === 'completed'
        ? 'green'
        : a.status === 'cancelled'
        ? 'red'
        : a.status === 'no_show'
        ? 'orange'
        : 'blue'
    }`}
  >
    {a.status}
  </span>
</td>

                <td>
                  <button
                    className="btn sm ghost"
                    onClick={() =>
                      remove(a._id)
                    }
                  >
                    <i className="ti ti-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {show && (
        <Schedule
          residents={residents}
          onClose={() => setShow(false)}
          onSave={async data => {
            await create(data);
            setShow(false);
          }}
        />
      )}
    </>
  );
}

function Schedule({
  residents,
  onSave,
  onClose
}) {
  const [d, setD] = useState({
    resident: residents[0]?._id || '',
    title: '',
    apptType: 'medical',
    scheduledAt: '',
    providerName: '',
    location: '',
    durationMin: 30,
    status: 'scheduled',
    notes: ''
  });

  return (
    <Modal
      title="Schedule Appointment"
      onClose={onClose}
      footer={
        <>
          <button
            className="btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn primary"
            onClick={() => onSave(d)}
          >
            Save
          </button>
        </>
      }
    >
      <Field label="Resident">
        <select
          value={d.resident}
          onChange={e =>
            setD({
              ...d,
              resident: e.target.value
            })
          }
        >
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

      <Field label="Title">
        <input
          value={d.title}
          onChange={e =>
            setD({
              ...d,
              title: e.target.value
            })
          }
        />
      </Field>

      <div className="grid cols-2">
        <Field label="Type">
          <select
            value={d.apptType}
            onChange={e =>
              setD({
                ...d,
                apptType: e.target.value
              })
            }
          >
            <option value="medical">
              Medical
            </option>
            <option value="dental">
              Dental
            </option>
            <option value="court">
              Court
            </option>
            <option value="IEP">
              IEP
            </option>
            <option value="therapy">
              Therapy
            </option>
          </select>
        </Field>

        <Field label="When">
          <input
            type="datetime-local"
            value={d.scheduledAt}
            onChange={e =>
              setD({
                ...d,
                scheduledAt:
                  e.target.value
              })
            }
          />
        </Field>
      </div>

      <Field label="Provider">
        <input
          value={d.providerName}
          onChange={e =>
            setD({
              ...d,
              providerName:
                e.target.value
            })
          }
        />
      </Field>

      <Field label="Location">
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

      <Field label="Duration (minutes)">
        <input
          type="number"
          value={d.durationMin}
          onChange={e =>
            setD({
              ...d,
              durationMin:
                Number(
                  e.target.value
                )
            })
          }
        />
      </Field>

      <Field label="Status">
        <select
          value={d.status}
          onChange={e =>
            setD({
              ...d,
              status:
                e.target.value
            })
          }
        >
          <option value="scheduled">
            Scheduled
          </option>
          <option value="completed">
            Completed
          </option>
          <option value="cancelled">
            Cancelled
          </option>
          <option value="no_show">
            No Show
          </option>
        </select>
      </Field>

      <Field label="Notes">
        <textarea
          rows="4"
          value={d.notes}
          onChange={e =>
            setD({
              ...d,
              notes:
                e.target.value
            })
          }
        />
      </Field>
    </Modal>
  );
}