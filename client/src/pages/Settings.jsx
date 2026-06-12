import { useState } from 'react';
import { PageHeader } from '../components/ui.jsx';

export default function Settings() {
  const [tab, setTab] = useState('general');
  return (
    <>
      <PageHeader title="Settings" />
      <div className="row" style={{ borderBottom: '1px solid var(--bdr)' }}>
        {['general','security','notifications','billing'].map(t => (
          <button key={t} className="btn ghost" onClick={() => setTab(t)}
            style={{ borderRadius: 0, borderBottom: tab === t ? '2px solid var(--blue)' : '2px solid transparent', color: tab === t ? 'var(--blue)' : 'var(--tx2)' }}>
            {t}
          </button>
        ))}
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        {tab === 'general' && <>
          <h3>Organisation</h3>
          <div className="field"><label>Display name</label><input defaultValue="Habitat Pilot" /></div>
          <div className="field"><label>Timezone</label><select><option>America/Los_Angeles</option><option>America/New_York</option><option>UTC</option></select></div>
          <button className="btn primary">Save</button>
        </>}
        {tab === 'security' && <>
          <h3>Security</h3>
          <label className="row"><input type="checkbox" defaultChecked /> Require 2FA for all users</label>
          <label className="row" style={{ marginTop: 8 }}><input type="checkbox" defaultChecked /> Lock accounts after 5 failed logins</label>
          <button className="btn primary" style={{ marginTop: 12 }}>Save</button>
        </>}
        {tab === 'notifications' && <>
          <h3>Email notifications</h3>
          <label className="row"><input type="checkbox" defaultChecked /> Behavioral incidents (SEV 4+)</label>
          <label className="row" style={{ marginTop: 8 }}><input type="checkbox" defaultChecked /> License expiring within 30 days</label>
          <label className="row" style={{ marginTop: 8 }}><input type="checkbox" /> Daily activity digest</label>
          <button className="btn primary" style={{ marginTop: 12 }}>Save</button>
        </>}
        {tab === 'billing' && <>
          <h3>Billing</h3>
          <p style={{ color: 'var(--tx2)' }}>No billing provider connected.</p>
        </>}
      </div>
    </>
  );
}
