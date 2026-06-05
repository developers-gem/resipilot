import { useState } from 'react';
import { useResource, PageHeader, Modal, Field } from '../components/ui.jsx';

export default function Bip() {
  const { items, create, remove } = useResource('/bip-plans');
  const residents = useResource('/residents').items;
  const [show, setShow] = useState(false);
  return (
    <>
      <PageHeader title="BIP — Behavior Intervention Plans" actions={
        <button className="btn primary" onClick={() => setShow(true)}><i className="ti ti-plus" /> New plan</button>
      } />
      <div className="grid cols-2">
        {items.length === 0 && <div className="empty" style={{ gridColumn: '1/-1' }}>No BIP plans yet.</div>}
        {items.map(p => (
          <div key={p._id} className="card">
            <div className="row" style={{
              padding: 18,
              borderLeft:
                p.status === 'active'
                  ? '4px solid #16a34a'
                  : '4px solid #94a3b8'
            }}>
              <strong>{p.title}</strong>
              <span
                className={`badge ${p.status === 'active'
                    ? 'green'
                    : p.status === 'draft'
                      ? 'amber'
                      : 'gray'
                  }`}
              ></span>
            </div>
            <div
              style={{
                marginTop: 12,
                display: 'grid',
                gap: 8
              }}
            >
              <div>
                <strong>Target:</strong>
                <div>{p.targetBehavior}</div>
              </div>

              <div>
                <strong>Triggers:</strong>
                <div>{p.hypothesis || '—'}</div>
              </div>

              <div>
                <strong>Replacement:</strong>
                <div>{p.replacement || '—'}</div>
              </div>

              <div>
                <strong>Reinforcement:</strong>
                <div>{p.reinforcement || '—'}</div>
              </div>
            </div>



            <button className="btn sm" style={{ marginTop: 8 }} onClick={() => remove(p._id)}><i className="ti ti-trash" /> Remove</button>
          </div>
        ))}
      </div>
      
      {show && <NewBip residents={residents} onClose={() => setShow(false)} onSave={async d => { await create(d); setShow(false); }} />}
    </>
  );
}
function NewBip({ residents, onSave, onClose }) {
  const [d, setD] = useState({ resident: residents[0]?._id || '', title: '', targetBehavior: '', replacement: '', reinforcement: '', crisisPlan: '', status: 'draft' });
  return (
    <Modal title="New BIP plan" onClose={onClose} footer={
      <><button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" onClick={() => onSave(d)}>Save</button></>
    }>
      <Field label="Resident"><select value={d.resident} onChange={e => setD({ ...d, resident: e.target.value })}>
        {residents.map(r => <option key={r._id} value={r._id}>{r.firstName} {r.lastName}</option>)}
      </select></Field>
      <Field label="Title"><input value={d.title} onChange={e => setD({ ...d, title: e.target.value })} /></Field>
      <Field label="Target Behavior *">
        <textarea
          rows="2"
          value={d.targetBehavior}
          onChange={e =>
            setD({
              ...d,
              targetBehavior: e.target.value
            })
          }
        />
      </Field>
      <Field label="Antecedents / Known Triggers">
        <textarea
          rows="3"
          value={d.hypothesis || ''}
          onChange={e =>
            setD({
              ...d,
              hypothesis: e.target.value
            })
          }
        />
      </Field>



      <Field label="Replacement Behavior">
        <textarea
          rows="3"
          value={d.replacement}
          onChange={e =>
            setD({
              ...d,
              replacement: e.target.value
            })
          }
        />
      </Field>

      <Field label="Preferred Reinforcements">
        <textarea
          rows="3"
          value={d.reinforcement}
          onChange={e =>
            setD({
              ...d,
              reinforcement: e.target.value
            })
          }
        />
      </Field>


      <Field label="Escalation Protocol / Crisis Plan">
        <textarea
          rows="4"
          value={d.crisisPlan}
          onChange={e =>
            setD({
              ...d,
              crisisPlan: e.target.value
            })
          }
        />
      </Field>

    </Modal>
  );
}
