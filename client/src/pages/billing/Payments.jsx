import { useEffect, useState } from 'react';
import { PageHeader, Modal, Field } from '../../components/ui.jsx';
import { facilityApi } from '../../lib/facilityApi.js';

export default function BillingPayments() {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [show, setShow] = useState(false);

  const [form, setForm] = useState({
    invoice: '',
    amount: '',
    method: 'Cash',
    reference: '',
    notes: '',
    paymentDate: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [paymentData, invoiceData] = await Promise.all([
      facilityApi.get('/billing/payments'),
      facilityApi.get('/billing/invoices'),
    ]);

    setPayments(paymentData);
    setInvoices(invoiceData);
  }

  async function save() {
    await facilityApi.post('/billing/payments', form);

    setShow(false);

    setForm({
      invoice: '',
      amount: '',
      method: 'Cash',
      reference: '',
      notes: '',
      paymentDate: new Date().toISOString().slice(0, 10),
    });

    load();
  }

  async function remove(id) {
    if (!confirm('Delete payment?')) return;

    await facilityApi.delete('/billing/payments/' + id);

    load();
  }

  return (
    <>
      <PageHeader
        title="Payments"
        actions={
          <button
            className="btn primary"
            onClick={() => setShow(true)}
          >
            <i className="ti ti-plus" />
            Record Payment
          </button>
        }
      />

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Invoice</th>
              <th>Resident</th>
              <th>Method</th>
              <th>Reference</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {payments.map(payment => (
              <tr key={payment._id}>
                <td>
                  {new Date(
                    payment.paymentDate
                  ).toLocaleDateString()}
                </td>

                <td>
                  {payment.invoice?.invoiceNumber}
                </td>

                <td>
                  {payment.resident?.firstName}{' '}
                  {payment.resident?.lastName}
                </td>

                <td>{payment.method}</td>

                <td>
                  {payment.reference || '-'}
                </td>

                <td>
                  $
                  {Number(payment.amount).toFixed(2)}
                </td>

                <td>
                  <button
                    className="btn danger sm"
                    onClick={() =>
                      remove(payment._id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: 'center',
                    padding: 30,
                  }}
                >
                  No payments recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {show && (
        <Modal
          title="Record Payment"
          onClose={() => setShow(false)}
          footer={
            <button
              className="btn primary"
              onClick={save}
            >
              Save
            </button>
          }
        >
          <Field label="Invoice">
            <select
              className="input"
              value={form.invoice}
              onChange={e =>
                setForm({
                  ...form,
                  invoice: e.target.value,
                })
              }
            >
              <option value="">
                Select Invoice
              </option>

              {invoices.map(inv => (
                <option
                  key={inv._id}
                  value={inv._id}
                >
                  {inv.invoiceNumber} —{' '}
                  {inv.resident?.firstName}{' '}
                  {inv.resident?.lastName}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Amount">
            <input
              className="input"
              type="number"
              value={form.amount}
              onChange={e =>
                setForm({
                  ...form,
                  amount: e.target.value,
                })
              }
            />
          </Field>

          <Field label="Payment Method">
            <select
              className="input"
              value={form.method}
              onChange={e =>
                setForm({
                  ...form,
                  method: e.target.value,
                })
              }
            >
              <option>Cash</option>
              <option>Card</option>
              <option>Bank Transfer</option>
              <option>Check</option>
              <option>Other</option>
            </select>
          </Field>

          <Field label="Reference">
            <input
              className="input"
              value={form.reference}
              onChange={e =>
                setForm({
                  ...form,
                  reference: e.target.value,
                })
              }
            />
          </Field>

          <Field label="Payment Date">
            <input
              className="input"
              type="date"
              value={form.paymentDate}
              onChange={e =>
                setForm({
                  ...form,
                  paymentDate: e.target.value,
                })
              }
            />
          </Field>

          <Field label="Notes">
            <textarea
              className="input"
              rows={3}
              value={form.notes}
              onChange={e =>
                setForm({
                  ...form,
                  notes: e.target.value,
                })
              }
            />
          </Field>
        </Modal>
      )}
    </>
  );
}