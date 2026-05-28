import { useMemo, useState } from 'react';
import {
  useResource,
  PageHeader,
  EmptyState,
  Modal,
  Field,
} from '../components/ui.jsx';

export default function Documents() {
  const docs = useResource('/documents');

  const [open, setOpen] = useState(false);

  const [tab, setTab] = useState('all');

  const [form, setForm] = useState({
    title: '',
    category: 'Legal',
    resident: '',
    fileUrl: '',
    isConfidential: false,
  });

  // ===== SUMMARY =====

  const awaiting = useMemo(() => {
    return docs.items.filter(
      d => d.status === 'Awaiting'
    );
  }, [docs.items]);

  const thisMonth = useMemo(() => {
    const now = new Date();

    return docs.items.filter(d => {
      const created = new Date(d.createdAt);

      return (
        created.getMonth() ===
          now.getMonth() &&
        created.getFullYear() ===
          now.getFullYear()
      );
    });
  }, [docs.items]);

  // ===== FILTER =====

  const filtered = useMemo(() => {
    if (tab === 'all') return docs.items;

    if (tab === 'awaiting') {
      return docs.items.filter(
        d => d.status === 'Awaiting'
      );
    }

    return docs.items.filter(
      d =>
        d.category?.toLowerCase() ===
        tab.toLowerCase()
    );
  }, [tab, docs.items]);

  // ===== CREATE =====

  async function uploadDoc() {
    await docs.create({
      ...form,
      status: 'Awaiting',
    });

    setOpen(false);

    setForm({
      title: '',
      category: 'Legal',
      resident: '',
      fileUrl: '',
      isConfidential: false,
    });

    docs.refresh();
  }

  function badge(status) {
    if (status === 'Signed') {
      return (
        <span className="badge green">
          ✓ Signed
        </span>
      );
    }

    if (status === 'Awaiting') {
      return (
        <span className="badge amber">
          Awaiting
        </span>
      );
    }

    if (status === 'In progress') {
      return (
        <span className="badge blue">
          In progress
        </span>
      );
    }

    return (
      <span className="badge gray">
        {status || 'Document'}
      </span>
    );
  }

  return (
    <>
      <PageHeader
        title="Documents vault"
        actions={
          <div
            style={{
              display: 'flex',
              gap: 12,
            }}
          >
            <button className="btn ghost">
              Export all
            </button>

            <button
              className="btn primary"
              onClick={() => setOpen(true)}
            >
              <i className="ti ti-upload" />
              Upload
            </button>
          </div>
        }
      />

      {/* ALERT */}

      {awaiting.length > 0 && (
        <div
          style={{
            background: '#FEF3C7',
            border: '1px solid #FCD34D',
            borderRadius: 14,
            padding: 16,
            marginBottom: 20,
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              color: '#92400E',
            }}
          >
            <strong>
              {awaiting.length} documents
              awaiting e-signature.
            </strong>
          </div>

          <button className="btn warning sm">
            Send reminders
          </button>
        </div>
      )}

      {/* SUMMARY */}

      <div
        className="grid cols-4"
        style={{
          marginBottom: 22,
        }}
      >
        <div className="card">
          <div
            style={{
              color: 'var(--tx3)',
              fontSize: 13,
            }}
          >
            Total documents
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            {docs.items.length}
          </div>

          <div
            style={{
              color: 'var(--tx3)',
              marginTop: 4,
            }}
          >
            All residents
          </div>
        </div>

        <div className="card">
          <div
            style={{
              color: 'var(--tx3)',
              fontSize: 13,
            }}
          >
            Awaiting e-sign
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              marginTop: 8,
              color: '#D97706',
            }}
          >
            {awaiting.length}
          </div>

          <div
            style={{
              color: 'var(--tx3)',
              marginTop: 4,
            }}
          >
            Action needed
          </div>
        </div>

        <div className="card">
          <div
            style={{
              color: 'var(--tx3)',
              fontSize: 13,
            }}
          >
            Added this month
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            {thisMonth.length}
          </div>

          <div
            style={{
              color: 'var(--tx3)',
              marginTop: 4,
            }}
          >
            Recently uploaded
          </div>
        </div>

        <div className="card">
          <div
            style={{
              color: 'var(--tx3)',
              fontSize: 13,
            }}
          >
            Retention policy
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              marginTop: 8,
              color: '#15803D',
            }}
          >
            7 yrs
          </div>

          <div
            style={{
              color: 'var(--tx3)',
              marginTop: 4,
            }}
          >
            HIPAA compliant
          </div>
        </div>
      </div>

      {/* TABS */}

      <div
        style={{
          display: 'flex',
          gap: 24,
          marginBottom: 18,
          borderBottom:
            '1px solid var(--line)',
          paddingBottom: 10,
        }}
      >
        {[
          ['all', 'All documents'],
          ['awaiting', 'Awaiting e-sign'],
          ['legal', 'Legal & court'],
          ['medical', 'Medical'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight:
                tab === key ? 700 : 500,
              color:
                tab === key
                  ? '#2563EB'
                  : '#666',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* LIST */}

      {filtered.length === 0 ? (
        <EmptyState
          icon="ti-folder-off"
          message="No documents uploaded."
        />
      ) : (
        <div
          className="card"
          style={{
            padding: 0,
            overflow: 'hidden',
          }}
        >
          {filtered.map(d => (
            <div
              key={d._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'space-between',
                padding:
                  '16px 20px',
                borderBottom:
                  '1px solid var(--line)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background:
                      d.status === 'Awaiting'
                        ? '#FEF3C7'
                        : d.status ===
                          'Signed'
                        ? '#DCFCE7'
                        : '#E0E7FF',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <i className="ti ti-file" />
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    {d.title}
                  </div>

                  <div
                    style={{
                      color:
                        'var(--tx3)',
                      fontSize: 13,
                      marginTop: 3,
                    }}
                  >
                    {new Date(
                      d.createdAt
                    ).toLocaleDateString()}
                    {' • '}
                    {d.category}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                }}
              >
                {badge(d.status)}

                <button className="btn ghost sm">
                  View
                </button>

                <button
                  className="btn ghost sm"
                  onClick={() =>
                    docs.remove(d._id)
                  }
                >
                  <i className="ti ti-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}

      {open && (
        <Modal
          title="Upload document"
          onClose={() => setOpen(false)}
          footer={
            <button
              className="btn primary"
              onClick={uploadDoc}
            >
              Upload document
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
              <Field label="Document title">
                <input
                  value={form.title}
                  onChange={e =>
                    setForm({
                      ...form,
                      title:
                        e.target.value,
                    })
                  }
                />
              </Field>
            </div>

            <Field label="Category">
              <select
                value={form.category}
                onChange={e =>
                  setForm({
                    ...form,
                    category:
                      e.target.value,
                  })
                }
              >
                <option>
                  Legal
                </option>

                <option>
                  Medical
                </option>

                <option>
                  Court
                </option>

                <option>
                  Consent
                </option>
              </select>
            </Field>

            <Field label="Resident">
              <input
                value={form.resident}
                onChange={e =>
                  setForm({
                    ...form,
                    resident:
                      e.target.value,
                  })
                }
              />
            </Field>

            <div
              style={{
                gridColumn: '1/-1',
              }}
            >
              <Field label="File URL">
                <input
                  value={form.fileUrl}
                  onChange={e =>
                    setForm({
                      ...form,
                      fileUrl:
                        e.target.value,
                    })
                  }
                />
              </Field>
            </div>

            <div
              style={{
                gridColumn: '1/-1',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems:
                    'center',
                  gap: 10,
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    form.isConfidential
                  }
                  onChange={e =>
                    setForm({
                      ...form,
                      isConfidential:
                        e.target.checked,
                    })
                  }
                />

                Confidential document
              </label>
            </div>

            <div
              style={{
                gridColumn: '1/-1',
              }}
            >
              <div
                style={{
                  border:
                    '2px dashed #d1d5db',
                  borderRadius: 14,
                  padding: 30,
                  textAlign: 'center',
                  color: '#666',
                }}
              >
                Click to upload or drag
                & drop
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}