import { useEffect, useState } from 'react';
import { PageHeader, Modal, Field } from '../../components/ui.jsx';
import { facilityApi } from '../../lib/facilityApi.js';

const emptyForm = {
  resident: '',
  service: '',
  units: 1,
  serviceDate: new Date().toISOString().slice(0, 10),
  staffName: '',
  notes: '',
};

export default function ServiceLogs() {
  const [logs, setLogs] = useState([]);
  const [residents, setResidents] = useState([]);
  const [services, setServices] = useState([]);

  const [show, setShow] = useState(false);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [l, r, s] = await Promise.all([
      facilityApi.get('/billing/service-logs'),
      facilityApi.get('/billing/residents'),
      facilityApi.get('/billing/services'),
    ]);

    setLogs(l);
    setResidents(r);
    setServices(s);
  }

  async function save() {
    await facilityApi.post(
      '/billing/service-logs',
      form
    );

    setShow(false);
    setForm(emptyForm);

    load();
  }

  return (
    <>
      <PageHeader
        title="Service Logs"
        actions={
          <button
            className="btn primary"
            onClick={() => setShow(true)}
          >
            <i className="ti ti-plus" />
            Log Service
          </button>
        }
      />

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Resident</th>
              <th>Service</th>
              <th>Units</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: 'center',
                    padding: 30,
                  }}
                >
                  No service logs yet.
                </td>
              </tr>
            )}

            {logs.map(log => (
              <tr key={log._id}>
                <td>
                  {new Date(
                    log.serviceDate
                  ).toLocaleDateString()}
                </td>

                <td>
                  {log.resident?.firstName}{' '}
                  {log.resident?.lastName}
                </td>

                <td>{log.serviceName}</td>

                <td>{log.units}</td>

                <td>${log.rate}</td>

                <td>${log.amount}</td>

                <td>
                  <span
                    className={`badge ${
                      log.status === 'Billed'
                        ? 'blue'
                        : 'green'
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {show && (
        <Modal
          title="Log Service"
          onClose={() => setShow(false)}
          footer={
            <>
              <button
                className="btn"
                onClick={() => setShow(false)}
              >
                Cancel
              </button>

              <button
                className="btn primary"
                onClick={save}
              >
                Save
              </button>
            </>
          }
        >
          <Field label="Resident">
            <select
              value={form.resident}
              onChange={e =>
                setForm({
                  ...form,
                  resident: e.target.value,
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

          <Field label="Service">
            <select
              value={form.service}
              onChange={e =>
                setForm({
                  ...form,
                  service: e.target.value,
                })
              }
            >
              <option value="">
                Select Service
              </option>

              {services.map(s => (
                <option
                  key={s._id}
                  value={s._id}
                >
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Units">
            <input
              type="number"
              min="1"
              value={form.units}
              onChange={e =>
                setForm({
                  ...form,
                  units: e.target.value,
                })
              }
            />
          </Field>

          <Field label="Date">
            <input
              type="date"
              value={form.serviceDate}
              onChange={e =>
                setForm({
                  ...form,
                  serviceDate:
                    e.target.value,
                })
              }
            />
          </Field>

          <Field label="Staff Name">
            <input
              value={form.staffName}
              onChange={e =>
                setForm({
                  ...form,
                  staffName:
                    e.target.value,
                })
              }
            />
          </Field>

          <Field label="Notes">
            <textarea
              rows="3"
              value={form.notes}
              onChange={e =>
                setForm({
                  ...form,
                  notes:
                    e.target.value,
                })
              }
            />
          </Field>
        </Modal>
      )}
    </>
  );
}