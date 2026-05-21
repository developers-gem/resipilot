import { useState } from 'react';
import { useResource, PageHeader, Modal, Field } from '../components/ui.jsx';

export default function Incidents() {
  const { items, create, remove } = useResource('/incident-reports');
  const [show, setShow] = useState(false);
  return (
    <>
      <PageHeader title="Incident Reports (IRR / CDSS)" actions={
        <button className="btn primary" onClick={() => setShow(true)}><i className="ti ti-plus" /> File report</button>
      } />
      <div className="table-wrap">
        <table>
          <thead><tr><th>Filed</th><th>Type</th><th>Severity</th><th>Status</th><th>Description</th><th></th></tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan="6" className="muted">No reports.</td></tr>}
            {items.map(i => (
              <tr key={i._id}>
                <td>{i.filedAt?.slice(0,10) || '—'}</td>
                <td>{i.reportType}</td>
                <td><span className={`badge ${+i.severity >= 4 ? 'red' : 'amber'}`}>{i.severity || '—'}</span></td>
                <td><span className="badge gray">{i.status}</span></td>
                <td>{i.description?.slice(0, 60)}</td>
                <td><button className="btn sm ghost" onClick={() => remove(i._id)}><i className="ti ti-trash" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {show && <NewIRR onClose={() => setShow(false)} onSave={async d => { await create({ ...d, filedAt: new Date() }); setShow(false); }} />}
    </>
  );
}
function NewIRR({ onSave, onClose }) {
  const [d, setD] = useState({ reportType: 'CDSS LIC624', description: '', severity: '3', status: 'submitted' });
  return (
    <Modal title="File incident report" onClose={onClose} footer={
      <><button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" onClick={() => onSave(d)}>File</button></>
    }>
      <Field label="Report type"><select value={d.reportType} onChange={e => setD({ ...d, reportType: e.target.value })}>
        <option>CDSS LIC624</option><option>injury</option><option>elopement</option><option>medication error</option>
      </select></Field>
      <Field label="Severity"><select value={d.severity} onChange={e => setD({ ...d, severity: e.target.value })}>
        {['1','2','3','4','5'].map(v => <option key={v}>{v}</option>)}
      </select></Field>
      <Field label="Description"><textarea rows="5" value={d.description} onChange={e => setD({ ...d, description: e.target.value })} /></Field>
    </Modal>
  );
}
