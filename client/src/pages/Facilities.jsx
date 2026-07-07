import { useState } from 'react';
import { useResource, PageHeader, Modal, Field } from '../components/ui.jsx';

export default function Facilities() {
  const { items, create, remove } = useResource('/facilities');
  const [showAdd, setShowAdd] = useState(false);
  return (
    <>
      <PageHeader title="Facilities" actions={
        <button className="btn primary" onClick={() => setShowAdd(true)}><i className="ti ti-plus" /> Add Facility</button>
      } />
      <div className="grid cols-3">
        {items.length === 0 && <div className="empty" style={{ gridColumn: '1/-1' }}>No facilities yet.</div>}
        {items.map(f => (
          <div key={f._id} className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{f.name}</div>
                <div style={{ color: 'var(--tx3)', fontSize: 11 }}>{f.slug}</div>
              </div>
              <button className="btn sm ghost" onClick={() => remove(f._id)}><i className="ti ti-trash" /></button>
            </div>
            <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--tx2)' }}>
              <div>{f.addressLine1}</div>
              <div>{f.city}{f.city && ', '}{f.state} {f.postalCode}</div>
              <div style={{ marginTop: 6 }}>Capacity: <strong>{f.capacity || 0}</strong></div>
              {f.licenseNumber && <div>License: {f.licenseNumber}</div>}
            </div>
          </div>
        ))}
      </div>
      {showAdd && <AddFacility onClose={() => setShowAdd(false)} onSave={async d => { await create(d); setShowAdd(false); }} />}
    </>
  );
}

function AddFacility({ onSave, onClose }) {
  const [d, setD] = useState({
  // Facility
  name: '',
  slug: '',
  type: 'FFA',

  addressLine1: '',
  city: '',
  state: '',
  postalCode: '',

  phone: '',
  email: '',

  capacity: 6,

  licenseNumber: '',
  licenseIssueDate: '',
  licenseExpiryDate: '',

  manager: '',
  populationServed: 'Ages 10–17, Mixed gender',

  specializations: [],

  notes: '',

  // -----------------------------
  // SaaS Subscription
  // -----------------------------

  plan: 'Professional',

  billingCycle: 'Monthly',

  subscriptionStatus: 'Trial',

  trialEnds: '',

  // -----------------------------
  // Facility Admin
  // -----------------------------

  adminName: '',

  adminEmail: '',

  adminPhone: '',

  adminPassword: '',
});

  const toggleSpecialization = value => {
    setD(prev => ({
      ...prev,
      specializations: prev.specializations.includes(value)
        ? prev.specializations.filter(v => v !== value)
        : [...prev.specializations, value]
    }));
  };

  return (
    <Modal
      title="Add new facility"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn primary"
            onClick={() =>
              onSave({
                ...d,
                slug: d.name
                  .toLowerCase()
                  .trim()
                  .replace(/\s+/g, '-')
                  .replace(/[^\w-]+/g, '')
              })
            }
          >            <i className="ti ti-building-community" />
           Create Facility
          </button>
        </>
      }
    >
      <div className="grid cols-2">
        <Field label="Facility name">
          <input
            placeholder="e.g. Meadow View Home"
            value={d.name}
            onChange={e => setD({ ...d, name: e.target.value })}
          />
        </Field>

        <Field label="Facility type">
          <select
            value={d.type}
            onChange={e => setD({ ...d, type: e.target.value })}
          >
            <option value="GROUP_HOME">
  Group Home
</option>

<option value="FFA">
  Foster Family Agency
</option>

<option value="STRTP">
  Short-Term Residential Therapeutic Program
</option>

<option value="THP">
  Transitional Housing Program
</option>

<option value="EMERGENCY">
  Emergency Shelter
</option>

<option value="SATELLITE">
  Satellite Facility
</option>

          </select>
        </Field>

        <hr style={{ margin: '22px 0' }} />

<h3>Subscription</h3>

<div className="grid cols-2">

  <Field label="Plan">
    <select
      value={d.plan}
      onChange={e =>
        setD({
          ...d,
          plan: e.target.value,
        })
      }
    >
      <option>Starter</option>
      <option>Professional</option>
      <option>Enterprise</option>
    </select>
  </Field>

  <Field label="Billing Cycle">
    <select
      value={d.billingCycle}
      onChange={e =>
        setD({
          ...d,
          billingCycle: e.target.value,
        })
      }
    >
      <option>Monthly</option>
      <option>Yearly</option>
    </select>
  </Field>

</div>

<div className="grid cols-2">

  <Field label="Status">
    <select
      value={d.subscriptionStatus}
      onChange={e =>
        setD({
          ...d,
          subscriptionStatus: e.target.value,
        })
      }
    >
      <option>Trial</option>
      <option>Active</option>
      <option>Suspended</option>
            <option>Cancelled</option>

    </select>
  </Field>

  <Field label="Trial Ends">
    <input
      type="date"
      value={d.trialEnds}
      onChange={e =>
        setD({
          ...d,
          trialEnds: e.target.value,
        })
      }
    />
  </Field>

</div>

<hr style={{ margin: '22px 0' }} />

<h3>Facility Administrator</h3>

<div className="grid cols-2">

  <Field label="Administrator Name">
    <input
      value={d.adminName}
      onChange={e =>
        setD({
          ...d,
          adminName: e.target.value,
        })
      }
    />
  </Field>

  <Field label="Administrator Email">
    <input
      value={d.adminEmail}
      onChange={e =>
        setD({
          ...d,
          adminEmail: e.target.value,
        })
      }
    />
  </Field>

</div>

<div className="grid cols-2">

  <Field label="Phone">
    <input
      value={d.adminPhone}
      onChange={e =>
        setD({
          ...d,
          adminPhone: e.target.value,
        })
      }
    />
  </Field>

  <Field label="Initial Password">
    <input
      type="password"
      value={d.adminPassword}
      onChange={e =>
        setD({
          ...d,
          adminPassword: e.target.value,
        })
      }
    />
  </Field>

</div>
      </div>



      <Field label="Street address">
        <input
          placeholder="Street address"
          value={d.addressLine1}
          onChange={e =>
            setD({ ...d, addressLine1: e.target.value })
          }
        />
      </Field>

      <div className="grid cols-3">
        <Field label="City">
          <input
            value={d.city}
            onChange={e => setD({ ...d, city: e.target.value })}
          />
        </Field>

        <Field label="State">
          <input
            value={d.state}
            onChange={e => setD({ ...d, state: e.target.value })}
          />
        </Field>

        <Field label="ZIP">
          <input
            value={d.postalCode}
            onChange={e =>
              setD({ ...d, postalCode: e.target.value })
            }
          />
        </Field>
      </div>

      <div className="grid cols-2">
        <Field label="Phone number">
          <input
            placeholder="(XXX) XXX-XXXX"
            value={d.phone}
            onChange={e => setD({ ...d, phone: e.target.value })}
          />
        </Field>

        <Field label="Email">
          <input
            placeholder="facility@frontlines.org"
            value={d.email}
            onChange={e => setD({ ...d, email: e.target.value })}
          />
        </Field>
      </div>

      <hr style={{ margin: '20px 0', borderColor: 'var(--bdr)' }} />

      <div className="grid cols-2">
        <Field label="Bed capacity">
          <input
            type="number"
            value={d.capacity}
            onChange={e =>
              setD({ ...d, capacity: +e.target.value })
            }
          />
        </Field>

        <Field label="CDSS license #">
          <input
            value={d.licenseNumber}
            onChange={e =>
              setD({ ...d, licenseNumber: e.target.value })
            }
          />
        </Field>
      </div>

      <div className="grid cols-2">
        <Field label="License issue date">
          <input
            type="date"
            value={d.licenseIssueDate}
            onChange={e =>
              setD({
                ...d,
                licenseIssueDate: e.target.value
              })
            }
          />
        </Field>

        <Field label="License expiry date">
          <input
            type="date"
            value={d.licenseExpiryDate}
            onChange={e =>
              setD({
                ...d,
                licenseExpiryDate: e.target.value
              })
            }
          />
        </Field>
      </div>

      <hr style={{ margin: '20px 0', borderColor: 'var(--bdr)' }} />

      <div className="grid cols-2">
        <Field label="Facility manager">
          <select
            value={d.manager}
            onChange={e =>
              setD({ ...d, manager: e.target.value })
            }
          >
            <option value="">Select manager</option>
            <option>D. Patel (Supervisor)</option>
            <option>John Smith</option>
          </select>
        </Field>

        <Field label="Population served">
          <select
            value={d.populationServed}
            onChange={e =>
              setD({
                ...d,
                populationServed: e.target.value
              })
            }
          >
            <option>Ages 10–17, Mixed gender</option>
            <option>Boys only</option>
            <option>Girls only</option>
          </select>
        </Field>
      </div>

      <Field label="Specializations">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 14,
            marginTop: 6
          }}
        >
          {[
            'Trauma-informed care',
            'CSEC',
            'LGBTQ+ affirming',
            'Bilingual (Spanish)',
            'Medically complex',
            'Sibling groups'
          ].map(item => (
            <label
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 14
              }}
            >
              <input
                type="checkbox"
                checked={d.specializations.includes(item)}
                onChange={() => toggleSpecialization(item)}
              />
              {item}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Additional notes">
        <textarea
          rows="4"
          placeholder="Any additional information about this facility..."
          value={d.notes}
          onChange={e => setD({ ...d, notes: e.target.value })}
        />
      </Field>
    </Modal>
  );
}
