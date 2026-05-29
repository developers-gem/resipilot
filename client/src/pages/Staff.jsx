import { useState } from 'react';
import {
  useResource,
  PageHeader,
  Modal,
  Field,
} from '../components/ui.jsx';

export default function Staff() {
  const { items, create, remove } =
    useResource('/staff');

  const facilities =
    useResource('/facilities').items;



  const [showAdd, setShowAdd] =
    useState(false);
const [d, setD] = useState({
  fullName: '',
  employeeId: '',
  title: '',
  facility: facilities[0]?._id || '',
  hiredAt: '',
});

console.log('STAFF ITEMS:', items);

  return (
    <>
      <PageHeader
        title="Staff"
        actions={
          <button
            className="btn primary"
            onClick={() =>
              setShowAdd(true)
            }
          >
            <i className="ti ti-plus" />
            Add Staff
          </button>
        }
      />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Title</th>
              <th>Facility</th>
              <th>Hired</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="muted"
                >
                  No staff yet.
                </td>
              </tr>
            )}

            {items.map(s => (
              <tr key={s._id}>
                <td>
                  {s.fullName ||
                    '—'}
                </td>

                <td>
                  {s.employeeId || '—'}
                </td>

                <td>
                  {s.title || '—'}
                </td>

                <td>
                  {s.facility?.name ||
                    facilities.find(
                      f =>
                        f._id ===
                        s.facility
                    )?.name ||
                    '—'}
                </td>

                <td>
                  {s.hiredAt?.slice(
                    0,
                    10
                  ) || '—'}
                </td>

                <td>
                  <button
                    className="btn sm ghost"
                    onClick={() =>
                      remove(s._id)
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

      {showAdd && (
        <AddStaff
          facilities={facilities}
          onClose={() =>
            setShowAdd(false)
          }
          onSave={async d => {
            await create(d);
            setShowAdd(false);
          }}
        />
      )}
    </>
  );
}

function AddStaff({
  facilities,
  onSave,
  onClose,
}) {
  const [d, setD] = useState({
    fullName: '',
    employeeId: '',
    title: '',
    facility:
      facilities[0]?._id || '',
    hiredAt: '',
  });

  return (
    <Modal
      title="Add Staff Member"
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
            Create
          </button>
        </>
      }
    >
     <Field label="Staff Name">
  <input
    value={d.fullName}
    onChange={e =>
      setD({
        ...d,
        fullName: e.target.value,
      })
    }
    placeholder="John Smith"
  />
</Field>

      <Field label="Employee ID">
        <input
          value={d.employeeId}
          onChange={e =>
            setD({
              ...d,
              employeeId:
                e.target.value,
            })
          }
        />
      </Field>

      <Field label="Title">
        <input
          value={d.title}
          onChange={e =>
            setD({
              ...d,
              title:
                e.target.value,
            })
          }
          placeholder="e.g. Direct Support, RN"
        />
      </Field>

      <Field label="Facility">
        <select
          value={d.facility}
          onChange={e =>
            setD({
              ...d,
              facility:
                e.target.value,
            })
          }
        >
          {facilities.map(f => (
            <option
              key={f._id}
              value={f._id}
            >
              {f.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Hire Date">
        <input
          type="date"
          value={d.hiredAt}
          onChange={e =>
            setD({
              ...d,
              hiredAt:
                e.target.value,
            })
          }
        />
      </Field>
    </Modal>
  );
}