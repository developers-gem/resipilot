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
  const [d, setD] = useState({ name: '', slug: '', capacity: 6, city: '', state: '', licenseNumber: '' });
  return (
    <Modal title="Add facility" onClose={onClose} footer={
      <><button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" onClick={() => onSave(d)}>Create</button></>
    }>
      <Field label="Name"><input value={d.name} onChange={e => setD({ ...d, name: e.target.value })} /></Field>
      <Field label="Slug (unique short id)"><input value={d.slug} onChange={e => setD({ ...d, slug: e.target.value })} /></Field>
      <div className="grid cols-2">
        <Field label="City"><input value={d.city} onChange={e => setD({ ...d, city: e.target.value })} /></Field>
        <Field label="State"><input value={d.state} onChange={e => setD({ ...d, state: e.target.value })} /></Field>
      </div>
      <div className="grid cols-2">
        <Field label="Capacity"><input type="number" value={d.capacity} onChange={e => setD({ ...d, capacity: +e.target.value })} /></Field>
        <Field label="License number"><input value={d.licenseNumber} onChange={e => setD({ ...d, licenseNumber: e.target.value })} /></Field>
      </div>
    </Modal>
  );
}
