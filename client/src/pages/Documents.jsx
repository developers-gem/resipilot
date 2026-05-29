import { useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import {
  useResource,
  PageHeader,
  EmptyState,
  Modal,
  Field,
} from '../components/ui.jsx';

export default function Documents() {
  const docs = useResource('/documents');
  const residents = useResource('/residents');
  const [open, setOpen] = useState(false);

  const [tab, setTab] = useState('all');

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  const [form, setForm] = useState({
    title: '',
    category: 'consent',
    resident: '',
    description: '',
    documentDate: new Date()
      .toISOString()
      .slice(0, 10),
    requiresESign: 'none',
    isConfidential: true,
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
    console.log(form);
    console.log(selectedFile);

    const fd = new FormData();

    fd.append('title', form.title);
    fd.append('resident', form.resident);
    fd.append('category', form.category);
    fd.append('description', form.description);
    fd.append('documentDate', form.documentDate);
    fd.append('requiresESign', form.requiresESign);
    fd.append('isConfidential', form.isConfidential);

    if (selectedFile) {
      fd.append('file', selectedFile);
    }

    const res = await api.upload('/documents', fd);

    console.log(res);

    docs.refresh();
    setOpen(false);
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
                      color: '#8B8B8B',
                      fontSize: 13,
                      marginTop: 4,
                    }}
                  >
                    {d.resident
                      ? `${d.resident.firstName} ${d.resident.lastName}`
                      : 'Unknown Resident'}

                    {' • '}

                    {d.requiresESign === 'none'
                      ? 'Informational only'
                      : 'Awaiting signature'}
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

                <button
                  className="btn ghost sm"
                  onClick={() => setPreviewDoc(d)}
                >
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
              <Field label="Document date">
                <input
                  type="date"
                  value={form.documentDate}
                  onChange={e =>
                    setForm({
                      ...form,
                      documentDate:
                        e.target.value,
                    })
                  }
                />
              </Field>
            </div>

            <Field label="Document type">
              <select
                value={form.category}
                onChange={e =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
              >
                <option value="consent">
                  Consent form
                </option>

                <option value="medical">
                  Medical record
                </option>

                <option value="legal">
                  Court order
                </option>

                <option value="education">
                  Education plan
                </option>

                <option value="licensing">
                  Licensing
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </Field>

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
                  Select resident
                </option>

                {residents.items.map(r => (
                  <option
                    key={r._id}
                    value={r._id}
                  >
                    {r.firstName} {r.lastName}
                  </option>
                ))}
              </select>
            </Field>

            <div
              style={{
                gridColumn: '1/-1',
              }}
            >


              <Field label="Requires e-signature">
                <select
                  value={form.requiresESign}
                  onChange={e =>
                    setForm({
                      ...form,
                      requiresESign:
                        e.target.value,
                    })
                  }
                >
                  <option value="none">
                    No
                  </option>

                  <option value="guardian">
                    Guardian signature
                  </option>

                  <option value="court">
                    Court signature
                  </option>

                  <option value="staff">
                    Staff acknowledgement
                  </option>
                </select>
              </Field>


              <Field label="Description">
                <textarea
                  rows={4}
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
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={e =>
                  setSelectedFile(
                    e.target.files?.[0]
                  )
                }
              />

              {selectedFile && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                  }}
                >
                  Selected:
                  {' '}
                  {selectedFile.name}
                </div>
              )}
            </div>
          </div>



        </Modal>

      )}

      {previewDoc && (
        <Modal
          title={previewDoc.title || 'Document Preview'}
          onClose={() => setPreviewDoc(null)}
        >
          <div
            style={{
              height: '75vh',
            }}
          >
            <iframe
              src={previewDoc.fileUrl}
              title="Document Preview"
              width="100%"
              height="100%"
              style={{
                border: 'none',
                borderRadius: 12,
              }}
            />
          </div>
        </Modal>
      )}

      {previewDoc && (
  <Modal
    title={previewDoc.title}
    onClose={() => setPreviewDoc(null)}
  >
    <div
      style={{
        height: '80vh',
      }}
    >
      <iframe
        src={`http://localhost:5000${previewDoc.fileUrl}`}
        title="Document Preview"
        width="100%"
        height="100%"
        style={{
          border: 'none',
          borderRadius: 12,
        }}
      />
    </div>
  </Modal>
)}
    </>
  );
}