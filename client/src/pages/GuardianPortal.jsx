import { useState } from 'react';
import { PageHeader, Field, EmptyState } from '../components/ui.jsx';

export default function GuardianPortal() {
  const [msg, setMsg] = useState('');
  return (
    <>
      <PageHeader title="Guardian Portal" actions={
        <button className="btn"><i className="ti ti-mail" /> Inbox</button>
      } />
      <div className="grid cols-2">
        <div className="card">
          <h3>Send a message to a guardian</h3>
          <Field label="Message"><textarea rows="4" value={msg} onChange={e => setMsg(e.target.value)} /></Field>
          <button className="btn primary" disabled={!msg}><i className="ti ti-send" /> Send</button>
        </div>
        <div className="card">
          <h3>Recent activity</h3>
          <EmptyState icon="ti-message" message="No guardian messages yet." />
        </div>
      </div>
    </>
  );
}
