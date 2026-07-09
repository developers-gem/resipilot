import { useEffect, useState } from 'react';
import { PageHeader, Modal, Field } from '../../components/ui.jsx';
import { facilityApi } from '../../lib/facilityApi.js';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  relationship: '',
  address: '',
};

export default function BillingPayers() {
  const [payers, setPayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadPayers();
  }, []);

  async function loadPayers() {
    try {
      const data = await facilityApi.get(
        '/billing/payers'
      );

      setPayers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    try {
      await facilityApi.post(
        '/billing/payers',
        form
      );

      setShowModal(false);
      setForm(emptyForm);

      loadPayers();
    } catch (err) {
      alert(err.message);
    }
  }

  async function remove(id) {
    if (!confirm('Delete payer?')) return;

    await facilityApi.delete(
      '/billing/payers/' + id
    );

    loadPayers();
  }

  return (
    <>
      <PageHeader
        title="Payers"
        actions={
          <button
            className="btn primary"
            onClick={() => setShowModal(true)}
          >
            <i className="ti ti-plus" />
            Add Payer
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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Relationship</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {payers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: 'center',
                      padding: 30,
                    }}
                  >
                    No payers found.
                  </td>
                </tr>
              )}

              {payers.map(payer => (
                <tr key={payer._id}>
                  <td>{payer.name}</td>

                  <td>{payer.email || '-'}</td>

                  <td>{payer.phone || '-'}</td>

                  <td>
                    {payer.relationship || '-'}
                  </td>

                  <td>
                    <button
                      className="btn danger sm"
                      onClick={() =>
                        remove(payer._id)
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
          title="Add Payer"
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
                onClick={save}
              >
                Save
              </button>
            </>
          }
        >
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

          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={e =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </Field>

          <Field label="Phone">
            <input
              value={form.phone}
              onChange={e =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />
          </Field>

          <Field label="Relationship">
            <input
              placeholder="Father, Guardian, Insurance..."
              value={form.relationship}
              onChange={e =>
                setForm({
                  ...form,
                  relationship:
                    e.target.value,
                })
              }
            />
          </Field>

          <Field label="Address">
            <textarea
              rows="3"
              value={form.address}
              onChange={e =>
                setForm({
                  ...form,
                  address:
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