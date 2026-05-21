import { useState } from 'react';
import { useResource, PageHeader, Modal, Field } from '../components/ui.jsx';

export default function Workload() {
  const { items, create, update, remove } = useResource('/tasks');
  const [show, setShow] = useState(false);
  const cols = { todo: [], in_progress: [], done: [], blocked: [] };
  items.forEach(t => (cols[t.status] = cols[t.status] || []).push(t));
  return (
    <>
      <PageHeader title="Tasks / Workload" actions={
        <button className="btn primary" onClick={() => setShow(true)}><i className="ti ti-plus" /> Add task</button>
      } />
      <div className="grid cols-4">
        {['todo','in_progress','blocked','done'].map(col => (
          <div key={col} className="card">
            <h3>{col.replace('_',' ')} <span style={{ color: 'var(--tx3)' }}>({(cols[col] || []).length})</span></h3>
            {(cols[col] || []).map(t => (
              <div key={t._id} className="row" style={{ padding: '8px 0', borderTop: '1px solid var(--bdr)' }}>
                <span style={{ flex: 1 }}>{t.title}</span>
                <span className={`badge ${t.priority === 'urgent' ? 'red' : t.priority === 'high' ? 'amber' : 'gray'}`}>{t.priority}</span>
                <select value={t.status} onChange={e => update(t._id, { status: e.target.value })} style={{ fontSize: 11 }}>
                  <option value="todo">todo</option><option value="in_progress">in progress</option>
                  <option value="blocked">blocked</option><option value="done">done</option>
                </select>
                <button className="btn sm ghost" onClick={() => remove(t._id)}><i className="ti ti-x" /></button>
              </div>
            ))}
          </div>
        ))}
      </div>
      {show && <AddTask onClose={() => setShow(false)} onSave={async d => { await create(d); setShow(false); }} />}
    </>
  );
}
function AddTask({ onSave, onClose }) {
  const [d, setD] = useState({ title: '', description: '', priority: 'medium', status: 'todo' });
  return (
    <Modal title="Add task" onClose={onClose} footer={
      <><button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" onClick={() => onSave(d)}>Create</button></>
    }>
      <Field label="Title"><input value={d.title} onChange={e => setD({ ...d, title: e.target.value })} /></Field>
      <Field label="Description"><textarea rows="3" value={d.description} onChange={e => setD({ ...d, description: e.target.value })} /></Field>
      <div className="grid cols-2">
        <Field label="Priority"><select value={d.priority} onChange={e => setD({ ...d, priority: e.target.value })}>
          <option>low</option><option>medium</option><option>high</option><option>urgent</option>
        </select></Field>
        <Field label="Status"><select value={d.status} onChange={e => setD({ ...d, status: e.target.value })}>
          <option value="todo">todo</option><option value="in_progress">in progress</option>
          <option value="blocked">blocked</option><option value="done">done</option>
        </select></Field>
      </div>
    </Modal>
  );
}
