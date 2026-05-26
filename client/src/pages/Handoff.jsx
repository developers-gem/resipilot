import { useState } from 'react';
import { useResource, PageHeader, Modal, Field } from '../components/ui.jsx';

export default function Handoff() {
  const { items, create, remove } = useResource('/shifts');
  const facilities = useResource('/facilities').items;
  const [show, setShow] = useState(false);
  return (
    <>
      <PageHeader title="Shift Handoff" actions={
        <button className="btn primary" onClick={() => setShow(true)}><i className="ti ti-plus" /> Log shift</button>
      } />
      <div className="table-wrap">
        <table>
          <thead><tr><th>Facility</th><th>Shift</th><th>Start</th><th>End</th><th>Handoff note</th><th></th></tr></thead>
            <tbody>
            {items.length === 0 && <tr><td colSpan="6" className="muted">No shifts logged.</td></tr>}
            {items.map(s => (
              <tr key={s._id}>
                <td>{facilities.find(f => f._id === s.facility)?.name || '—'}</td>
                <td><span className="badge blue">{s.shiftType}</span></td>
                <td>{new Date(s.startsAt).toLocaleString()}</td>
                <td>{new Date(s.endsAt).toLocaleString()}</td>
                <td>{s.handoffNote?.slice(0, 80) || '—'}</td>
                <td><button className="btn sm ghost" onClick={() => remove(s._id)}><i className="ti ti-trash" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {show && <NewShift facilities={facilities} onClose={() => setShow(false)} onSave={async d => { await create(d); setShow(false); }} />}
    </>
  );
}
function NewShift({ facilities, onSave, onClose }) {
  const [d, setD] = useState({ facility: facilities[0]?._id || '', shiftType: 'day', startsAt: '', endsAt: '', handoffNote: '' });
  return (
    <Modal title="Log shift handoff" onClose={onClose} footer={
      <><button className="btn" onClick={onClose}>Cancel</button>
<button
  className="btn primary"
  onClick={() => {
    if (!d.startsAt || !d.endsAt) {
      alert('Please select start and end time');
      return;
    }

    onSave(d);
  }}
>
  Save
</button></>
    }>
      <Field label="Facility"><select value={d.facility} onChange={e => setD({ ...d, facility: e.target.value })}>
        {facilities.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
      </select></Field>
      <Field label="Shift type"><select value={d.shiftType} onChange={e => setD({ ...d, shiftType: e.target.value })}>
        <option>day</option><option>evening</option><option>night</option>
      </select></Field>
      <div className="grid cols-2">
        <Field label="Start"><input type="datetime-local" value={d.startsAt} onChange={e => setD({ ...d, startsAt: e.target.value })} /></Field>
        <Field label="End"><input type="datetime-local" value={d.endsAt} onChange={e => setD({ ...d, endsAt: e.target.value })} /></Field>
      </div>
      <Field label="Handoff note"><textarea rows="4" value={d.handoffNote} onChange={e => setD({ ...d, handoffNote: e.target.value })} /></Field>
    </Modal>
  );
}
