import { useEffect, useState } from 'react';
import { PageHeader, Modal, Field } from '../../components/ui.jsx';
import { facilityApi } from '../../lib/facilityApi.js';

const emptyForm = {
  code: '',
  name: '',
  description: '',
  category: 'General',
  unit: 'Visit',
  rate: '',
};

export default function BillingServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const data = await facilityApi.get(
        '/billing/services'
      );

      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function saveService() {
    try {
      await facilityApi.post(
        '/billing/services',
        {
          ...form,
          rate: Number(form.rate),
        }
      );

      setShowModal(false);

      setForm(emptyForm);

      loadServices();
    } catch (err) {
      alert(err.message);
    }
  }

  async function remove(id) {
    if (!confirm('Delete this service?')) {
      return;
    }

    await facilityApi.delete(
      `/billing/services/${id}`
    );

    loadServices();
  }

  return (
    <>
      <PageHeader
        title="Billing Services"
        actions={
          <button
            className="btn primary"
            onClick={() =>
              setShowModal(true)
            }
          >
            <i className="ti ti-plus" />
            Add Service
          </button>
        }
      />

      <div className="card">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {services.map(service => (
                <tr key={service._id}>
                  <td>{service.code}</td>

                  <td>{service.name}</td>

                  <td>
                    {service.category}
                  </td>

                  <td>{service.unit}</td>

                  <td>
                    $
                    {service.rate.toFixed(2)}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        service.active
                          ? 'green'
                          : 'gray'
                      }`}
                    >
                      {service.active
                        ? 'Active'
                        : 'Inactive'}
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn sm danger"
                      onClick={() =>
                        remove(service._id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal
          title="Add Billing Service"
          onClose={() =>
            setShowModal(false)
          }
          footer={
            <>
              <button
                className="btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="btn primary"
                onClick={saveService}
              >
                Save
              </button>
            </>
          }
        >
          <Field label="Code">
            <input
              value={form.code}
              onChange={e =>
                setForm({
                  ...form,
                  code: e.target.value,
                })
              }
            />
          </Field>

          <Field label="Name">
            <input
              value={form.name}
              onChange={e =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </Field>

          <Field label="Description">
            <textarea
              rows="3"
              value={form.description}
              onChange={e =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
            />
          </Field>

          <Field label="Category">
            <input
              value={form.category}
              onChange={e =>
                setForm({
                  ...form,
                  category:
                    e.target.value,
                })
              }
            />
          </Field>

          <Field label="Unit">
            <select
              value={form.unit}
              onChange={e =>
                setForm({
                  ...form,
                  unit: e.target.value,
                })
              }
            >
              <option>Hour</option>
              <option>Day</option>
              <option>Visit</option>
              <option>Session</option>
              <option>Medication</option>
              <option>Each</option>
            </select>
          </Field>

          <Field label="Rate">
            <input
              type="number"
              value={form.rate}
              onChange={e =>
                setForm({
                  ...form,
                  rate: e.target.value,
                })
              }
            />
          </Field>
        </Modal>
      )}
    </>
  );
}