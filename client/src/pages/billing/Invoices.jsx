import { useEffect, useState } from 'react';
import { PageHeader, Modal, Field } from '../../components/ui.jsx';
import { facilityApi } from '../../lib/facilityApi.js';

export default function BillingInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [residents, setResidents] = useState([]);

  const [show, setShow] = useState(false);

  const [form, setForm] = useState({
    resident: '',
    fromDate: '',
    toDate: '',
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [i, r] = await Promise.all([
      facilityApi.get('/billing/invoices'),
      facilityApi.get('/billing/residents'),
    ]);

    setInvoices(i);
    setResidents(r);
  }

  async function generate() {
    await facilityApi.post(
      '/billing/invoices/generate',
      form
    );

    setShow(false);

    setForm({
      resident: '',
      fromDate: '',
      toDate: '',
    });

    load();
  }

  return (
    <>
      <PageHeader
        title="Invoices"
        actions={
          <button
            className="btn primary"
            onClick={() => setShow(true)}
          >
            <i className="ti ti-plus" />
            Generate Invoice
          </button>
        }
      />

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Resident</th>
              <th>Total</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>

          <tbody>
            {invoices.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: 'center',
                    padding: 30,
                  }}
                >
                  No invoices found.
                </td>
              </tr>
            )}

            {invoices.map(invoice => (
              <tr key={invoice._id}>
                <td>{invoice.invoiceNumber}</td>

                <td>
                  {invoice.resident?.firstName}{' '}
                  {invoice.resident?.lastName}
                </td>

                <td>
                  $
                  {invoice.total.toFixed(2)}
                </td>

                <td>
                  <span
                    className={`badge ${
                      invoice.status === 'Paid'
                        ? 'green'
                        : 'orange'
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>

                <td>
                  {new Date(
                    invoice.dueDate
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {show && (
        <Modal
          title="Generate Invoice"
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
                onClick={generate}
              >
                Generate
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

          <Field label="From Date">
            <input
              type="date"
              value={form.fromDate}
              onChange={e =>
                setForm({
                  ...form,
                  fromDate: e.target.value,
                })
              }
            />
          </Field>

          <Field label="To Date">
            <input
              type="date"
              value={form.toDate}
              onChange={e =>
                setForm({
                  ...form,
                  toDate: e.target.value,
                })
              }
            />
          </Field>
        </Modal>
      )}
    </>
  );
}