import { useMemo, useState } from 'react';
import {
  useResource,
  PageHeader,
  Modal,
  Field,
} from '../components/ui.jsx';

export default function Training() {
  const certs = useResource('/certifications');
  const courses = useResource('/training-courses');
  const staff = useResource('/staff');

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    staff: '',
    course: '',
    certName: '',
    issuedOn: '',
    expiresOn: '',
    score: '',
    hours: '',
  });

  // ===== SUMMARY =====

  const expiringSoon = useMemo(() => {
    const now = new Date();

    return certs.items.filter(c => {
      if (!c.expiresOn) return false;

      const exp = new Date(c.expiresOn);
      const diff = (exp - now) / (1000 * 60 * 60 * 24);

      return diff <= 14;
    });
  }, [certs.items]);

  const compliance = useMemo(() => {
    if (!certs.items.length) return 0;

    const valid = certs.items.filter(
      c => c.status === 'valid'
    ).length;

    return Math.round((valid / certs.items.length) * 100);
  }, [certs.items]);

  // ===== GROUP STAFF =====

  const grouped = useMemo(() => {
    const map = {};

    staff.items.forEach(s => {
      map[s._id] = {
        staff: s,
        certs: {},
      };
    });

    certs.items.forEach(c => {
      if (!c.staff?._id || !c.course?.name) return;

      if (!map[c.staff._id]) {
        map[c.staff._id] = {
          staff: c.staff,
          certs: {},
        };
      }

      map[c.staff._id].certs[c.course.name] = c;
    });

    return Object.values(map);
  }, [staff.items, certs.items]);

  // ===== CREATE =====

  async function logTraining() {
    if (
      !form.staff ||
      !form.course ||
      !form.issuedOn
    ) {
      return alert('Please fill required fields');
    }

    const course = courses.items.find(
      c => c._id === form.course
    );

    await certs.create({
      staff: form.staff,
      course: form.course,
      certName: course?.name || 'Certification',
      issuedOn: form.issuedOn,
      expiresOn: form.expiresOn,
      status: 'valid',
    });

    setOpen(false);

    setForm({
      staff: '',
      course: '',
      certName: '',
      issuedOn: '',
      expiresOn: '',
      score: '',
      hours: '',
    });

    certs.refresh();
  }

  function getStatus(cert) {
    if (!cert) {
      return (
        <span style={{ color: '#999' }}>
          N/A
        </span>
      );
    }

    if (cert.status === 'expired') {
      return (
        <span style={{ color: '#dc2626' }}>
          ✕ Overdue
        </span>
      );
    }

    if (cert.status === 'expiring') {
      return (
        <span style={{ color: '#d97706' }}>
          ⚠ {cert.expiresOn?.slice(0, 10)}
        </span>
      );
    }

    return (
      <span style={{ color: '#15803d' }}>
        ✓ {cert.expiresOn?.slice(0, 10)}
      </span>
    );
  }

  return (
    <>
      <PageHeader
        title="Training & certifications"
        actions={
          <div
            style={{
              display: 'flex',
              gap: 12,
            }}
          >
            <button className="btn ghost">
              Export matrix
            </button>

            <button
              className="btn primary"
              onClick={() => setOpen(true)}
            >
              + Log training
            </button>
          </div>
        }
      />

      {/* ALERT */}

      {expiringSoon.length > 0 && (
        <div
          style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            padding: 16,
            borderRadius: 14,
            marginBottom: 18,
            color: '#b91c1c',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <strong>
              {expiringSoon.length} certifications
              expiring within 14 days.
            </strong>
          </div>

          <button className="btn danger sm">
            Book renewal
          </button>
        </div>
      )}

      {/* CARDS */}

      <div
        className="grid cols-4"
        style={{ marginBottom: 20 }}
      >
        <div className="card">
          <div
            style={{
              fontSize: 13,
              color: 'var(--tx3)',
            }}
          >
            Agency compliance
          </div>

          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              marginTop: 8,
              color:
                compliance > 80
                  ? '#15803d'
                  : '#d97706',
            }}
          >
            {compliance}%
          </div>

          <div
            style={{
              color: 'var(--tx3)',
              marginTop: 6,
            }}
          >
            Target: 100%
          </div>
        </div>

        <div className="card">
          <div
            style={{
              fontSize: 13,
              color: 'var(--tx3)',
            }}
          >
            Total staff
          </div>

          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            {staff.items.length}
          </div>

          <div
            style={{
              color: 'var(--tx3)',
              marginTop: 6,
            }}
          >
            Active staff members
          </div>
        </div>

        <div className="card">
          <div
            style={{
              fontSize: 13,
              color: 'var(--tx3)',
            }}
          >
            Expiring 14 days
          </div>

          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              marginTop: 8,
              color: '#dc2626',
            }}
          >
            {expiringSoon.length}
          </div>

          <div
            style={{
              color: 'var(--tx3)',
              marginTop: 6,
            }}
          >
            Immediate action needed
          </div>
        </div>

        <div className="card">
          <div
            style={{
              fontSize: 13,
              color: 'var(--tx3)',
            }}
          >
            Required cert types
          </div>

          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            {courses.items.length}
          </div>

          <div
            style={{
              color: 'var(--tx3)',
              marginTop: 6,
              fontSize: 13,
            }}
          >
            {courses.items
              .map(c => c.name)
              .join(', ')}
          </div>
        </div>
      </div>

      {/* MATRIX */}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Staff member</th>

              <th>Role</th>

              {courses.items.map(c => (
                <th key={c._id}>
                  {c.name}
                </th>
              ))}

              <th>Overall</th>
            </tr>
          </thead>

          <tbody>
            {grouped.map(row => {
              const all = courses.items.length;

              const valid = Object.values(
                row.certs
              ).filter(
                c => c.status === 'valid'
              ).length;

              const percent = all
                ? Math.round((valid / all) * 100)
                : 0;

              return (
                <tr key={row.staff._id}>
                  <td
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    {row.staff.fullName ||
                      row.staff.employeeId ||
                      'Staff'}
                  </td>

                  <td>
                    <span className="badge blue">
                      {row.staff.title || 'Staff'}
                    </span>
                  </td>

                  {courses.items.map(course => (
                    <td key={course._id}>
                      {getStatus(
                        row.certs[course.name]
                      )}
                    </td>
                  ))}

                  <td>
                    <span
                      className={`badge ${
                        percent === 100
                          ? 'green'
                          : percent >= 75
                          ? 'amber'
                          : 'red'
                      }`}
                    >
                      {percent}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}

      {open && (
        <Modal
          title="Log training / certification"
          onClose={() => setOpen(false)}
          footer={
            <button
              className="btn primary"
              onClick={logTraining}
            >
              Log training record
            </button>
          }
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: 18,
            }}
          >
            <div
              style={{
                gridColumn: '1/-1',
              }}
            >
              <Field label="Staff member">
                <select
                  value={form.staff}
                  onChange={e =>
                    setForm({
                      ...form,
                      staff: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Select staff
                  </option>

                  {staff.items.map(s => (
                    <option
                      key={s._id}
                      value={s._id}
                    >
                      {s.fullName ||
                        s.employeeId}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div
              style={{
                gridColumn: '1/-1',
              }}
            >
              <Field label="Training / certification type">
                <select
                  value={form.course}
                  onChange={e =>
                    setForm({
                      ...form,
                      course: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Select course
                  </option>

                  {courses.items.map(c => (
                    <option
                      key={c._id}
                      value={c._id}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Completion date">
              <input
                type="date"
                value={form.issuedOn}
                onChange={e =>
                  setForm({
                    ...form,
                    issuedOn: e.target.value,
                  })
                }
              />
            </Field>

            <Field label="Expiration date">
              <input
                type="date"
                value={form.expiresOn}
                onChange={e =>
                  setForm({
                    ...form,
                    expiresOn: e.target.value,
                  })
                }
              />
            </Field>

            <Field label="Score / result">
              <input
                placeholder="94% / Pass"
                value={form.score}
                onChange={e =>
                  setForm({
                    ...form,
                    score: e.target.value,
                  })
                }
              />
            </Field>

            <Field label="Training hours">
              <input
                placeholder="8"
                value={form.hours}
                onChange={e =>
                  setForm({
                    ...form,
                    hours: e.target.value,
                  })
                }
              />
            </Field>

            <div
              style={{
                gridColumn: '1/-1',
              }}
            >
              <Field label="Upload certificate">
                <div
                  style={{
                    border:
                      '2px dashed #d1d5db',
                    borderRadius: 14,
                    padding: 28,
                    textAlign: 'center',
                    color: '#6b7280',
                  }}
                >
                  Click to upload or drag &
                  drop
                </div>
              </Field>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}