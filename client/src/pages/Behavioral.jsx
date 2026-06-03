import { useState } from 'react';
import { useResource, PageHeader, Modal, Field } from '../components/ui.jsx';

export default function Behavioral() {
  const { items, create, remove } = useResource('/behavioral-incidents');
  const residents = useResource('/residents').items;
  const [show, setShow] = useState(false);
  return (
    <>
      <PageHeader title="Behavioral Log (ABC)" actions={
        <button className="btn primary" onClick={() => setShow(true)}><i className="ti ti-plus" /> New incident</button>
      } />
      <div className="table-wrap">
        <table>
          <thead><tr><th>When</th><th>Resident</th><th>Severity</th><th>Behavior</th><th>Injury</th><th></th></tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan="6" className="muted">None recorded.</td></tr>}
            {items.map(i => (
              <tr key={i._id}>
                <td>{new Date(i.occurredAt).toLocaleString()}</td>
                <td>{residents.find(r => r._id === i.resident)?.firstName || '—'}</td>
                <td><span className={`badge ${+i.severity >= 4 ? 'red' : +i.severity >= 3 ? 'amber' : 'gray'}`}>SEV {i.severity}</span></td>
                <td>{i.behavior?.slice(0, 80)}</td>
                <td>{i.injury ? <span className="badge red">yes</span> : '—'}</td>
                <td><button className="btn sm ghost" onClick={() => remove(i._id)}><i className="ti ti-trash" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {show && <NewIncident residents={residents} onClose={() => setShow(false)} onSave={async d => { await create(d); setShow(false); }} />}
    </>
  );
}
function NewIncident({ residents, onSave, onClose }) {
  const [d, setD] = useState({
    resident: residents[0]?._id || '',
    occurredAt: new Date().toISOString().slice(0, 16),
    location: '',
    behaviorTypes: [],
    severity: '2',
    antecedent: '',
    behavior: '',
    consequence: '',
    interventions: [],
    durationMin: '',
    injury: false
  });

  return (
    <Modal title="Behavioral incident (ABC)" onClose={onClose} footer={
      <><button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" onClick={() => onSave(d)}>Save</button></>
    }>
      <div className="grid cols-2">
        <Field label="Resident"><select value={d.resident} onChange={e => setD({ ...d, resident: e.target.value })}>
          {residents.map(r => <option key={r._id} value={r._id}>{r.firstName} {r.lastName}</option>)}
        </select></Field>
        <Field label="When"><input type="datetime-local" value={d.occurredAt} onChange={e => setD({ ...d, occurredAt: e.target.value })} /></Field>
      </div>
      <Field label="Severity">
        <select value={d.severity} onChange={e => setD({ ...d, severity: e.target.value })}>
          {['1', '2', '3', '4', '5'].map(v => <option key={v}>{v}</option>)}
        </select>
      </Field>
      <Field label="Antecedent (what triggered it?)"><textarea rows="2" value={d.antecedent} onChange={e => setD({ ...d, antecedent: e.target.value })} /></Field>
      <Field label="Behavior (what happened?)"><textarea rows="3" value={d.behavior} onChange={e => setD({ ...d, behavior: e.target.value })} /></Field>
      <Field label="Consequence (response & outcome)"><textarea rows="2" value={d.consequence} onChange={e => setD({ ...d, consequence: e.target.value })} /></Field>
      <Field label="Location">
        <input
          value={d.location}
          onChange={e =>
            setD({
              ...d,
              location: e.target.value
            })
          }
        />
      </Field>
      <Field label="Behavior Type">
  <select
    onChange={e =>
      setD({
        ...d,
        behaviorTypes: [e.target.value]
      })
    }
  >
    <option value="">Select</option>
    <option value="Aggression">Aggression</option>
    <option value="Property Destruction">Property Destruction</option>
    <option value="Self Harm">Self Harm</option>
    <option value="Verbal Outburst">Verbal Outburst</option>
    <option value="Elopement">Elopement</option>
  </select>
</Field>
<Field label="Intervention Used">
  <input
    placeholder="Redirection, De-escalation, etc."
    onChange={e =>
      setD({
        ...d,
        interventions: [e.target.value]
      })
    }
  />
</Field>
<Field label="Duration (minutes)">
  <input
    type="number"
    value={d.durationMin}
    onChange={e =>
      setD({
        ...d,
        durationMin: Number(e.target.value)
      })
    }
  />
</Field>
      <label className="row"><input type="checkbox" checked={d.injury} onChange={e => setD({ ...d, injury: e.target.checked })} /> Injury occurred</label>
    </Modal>
  );
}
