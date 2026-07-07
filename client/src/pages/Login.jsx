import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFacilityAuth } from '../lib/facilityAuth.jsx';

export default function Login() {
  const { login } = useFacilityAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('');
    try { await login(email, password); nav('/'); }
    catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }
  return (
    <div className="login">
      <form className="login-card" onSubmit={submit}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div className="sb-logo" style={{ width: 40, height: 40 }}>HP</div>
          <div>
            <h1>Habitat Pilot</h1>
            <div className="sub">Sign in to continue</div>
          </div>
        </div>
        <div className="field"><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="field"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
        {err && <div className="error">{err}</div>}
        <button className="btn primary" disabled={busy} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        {/* <div style={{ marginTop: 14, fontSize: 11, color: 'var(--tx3)' }}>
          Seed user: <code>admin@example.com</code> / <code>admin123</code>
        </div> */}
      </form>
    </div>
  );
}
