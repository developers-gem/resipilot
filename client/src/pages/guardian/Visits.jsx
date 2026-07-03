import { useState, useEffect } from 'react';

import {
  PageHeader,
  useResource,
  Modal,
  Field,
} from '../../components/guardian-ui.jsx';


import { useGuardianAuth } from '../../lib/guardianAuth.jsx';



export default function GuardianVisits() {
  const { guardian } = useGuardianAuth();
  const visits = useResource(
    guardian?.resident?._id
      ? `/visits/resident/${guardian.resident._id}`
      : '',
    '/visits'
  );
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    resident: guardian?.resident?._id || '',
    scheduledFor: '',
    notes: '',
  });


  useEffect(() => {
    if (guardian?.resident?._id) {
      setForm(f => ({
        ...f,
        resident: guardian.resident._id,
      }));
    }
  }, [guardian]);

  async function requestVisit() {
    if (!form.resident || !form.scheduledFor) {
      alert('Please complete all required fields.');
      return;
    }

    try {
      await visits.create({
        guardian: guardian._id,
        resident: form.resident,
        scheduledFor: form.scheduledFor,
        notes: form.notes,
      });

      setShowModal(false);

      setForm({
        resident: guardian.resident._id,
        scheduledFor: '',
        notes: '',
      });

      visits.refresh();
    } catch (err) {
      console.error(err);
      alert('Unable to request visit.');
    }
  }

  return (
    <>
      <PageHeader
        title="Visits"
        actions={
          <button
            className="btn primary"
            onClick={() => setShowModal(true)}
          >
            <i className="ti ti-calendar-plus" />
            Request Visit
          </button>
        }
      />

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Requested For</th>
              <th>Resident</th>
              <th>Status</th>
              <th>Requested On</th>
              <th>Notes</th>
              <th>Approved</th>
            </tr>
          </thead>

          <tbody>
            {visits.items.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: 'center' }}
                >
                  You haven't requested any visits yet.                </td>
              </tr>
            )}

            {visits.items.map((v) => (
              <tr key={v._id}>
                <td>
                  {new Date(v.createdAt).toLocaleDateString()}
                </td>

                <td>
                  {v.resident?.firstName}{' '}
                  {v.resident?.lastName}
                </td>

                <td>
                  <span
                    className={`badge ${v.status === 'Approved'
                      ? 'green'
                      : v.status === 'Rejected'
                        ? 'red'
                        : v.status === 'Completed'
                          ? 'blue'
                          : v.status === 'Cancelled'
                            ? 'gray'
                            : 'amber'
                      }`}
                  >
                    {v.status}
                  </span>
                </td>

                <td>
                  {v.approvedAt
                    ? new Date(v.approvedAt).toLocaleDateString()
                    : '-'}
                </td>

                <td className="muted">
                  {v.notes || '-'}
                </td>              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal
          title="Request a Visit"
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button
                className="btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn primary"
                disabled={!form.resident || !form.scheduledFor}
                onClick={requestVisit}
              >
                Submit Request
              </button>
            </>
          }
        >
          <Field label="Resident">
            <input
              readOnly
              value={`${guardian?.resident?.firstName || ''} ${guardian?.resident?.lastName || ''}`}
            />
          </Field>

          <Field label="Visit Date & Time">
            <input
              type="datetime-local"
              value={form.scheduledFor}
              onChange={(e) =>
                setForm({
                  ...form,
                  scheduledFor: e.target.value,
                })
              }
            />
          </Field>

          <Field label="Notes">
            <textarea
              rows="4"
              value={form.notes}
              onChange={(e) =>
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