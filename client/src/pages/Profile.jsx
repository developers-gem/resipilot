import { useAuth } from '../lib/auth.jsx';
import { PageHeader } from '../components/ui.jsx';

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <>
      <PageHeader title="My Profile" />
      <div className="card">
        <div className="row" style={{ gap: 16 }}>
          <div className="sb-avatar" style={{ width: 64, height: 64, fontSize: 24 }}>
            {user.fullName?.slice(0,1)}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{user.fullName}</div>
            <div style={{ color: 'var(--tx2)' }}>{user.email}</div>
            <div style={{ marginTop: 6 }}>
              {(user.roles || []).map(r => <span key={r} className="badge blue" style={{ marginRight: 4 }}>{r}</span>)}
            </div>
          </div>
        </div>
        <div className="grid cols-2" style={{ marginTop: 18 }}>
          <Info label="Phone" v={user.phone} />
          <Info label="Last login" v={user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '—'} />
          <Info label="Account created" v={new Date(user.createdAt).toLocaleDateString()} />
          <Info label="Status" v={user.isActive ? 'Active' : 'Disabled'} />
        </div>
      </div>
    </>
  );
}
function Info({ label, v }) {
  return <div><div style={{ fontSize: 11, color: 'var(--tx3)', textTransform: 'uppercase' }}>{label}</div><div>{v || '—'}</div></div>;
}
