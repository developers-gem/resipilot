import { Link, Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './lib/auth.jsx';
import { NAV } from './lib/nav.js';

export default function App() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const title = NAV.flatMap(s => s.items).find(i => i.to === loc.pathname)?.label
              || (loc.pathname.startsWith('/residents/') ? 'Resident Detail' : 'FrontLines Care');

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sb-brand">
          <div className="sb-logo">FC</div>
          <div>
            <div className="sb-name">FrontLines Care</div>
            <div className="sb-sub">Group-home operations</div>
          </div>
        </div>
        {NAV.map(group => (
          <div key={group.section}>
            <div className="sb-sec">{group.section}</div>
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => 'ni' + (isActive ? ' on' : '')}
              >
                <i className={`ti ${item.icon} ni-icon`} />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
        <div className="sb-user">
          <div className="sb-avatar">{(user?.fullName || 'U').slice(0,1).toUpperCase()}</div>
          <div>
            <div style={{ fontWeight: 500 }}>{user?.fullName}</div>
            <div style={{ color: 'var(--tx3)', fontSize: 10 }}>{(user?.roles || []).join(', ')}</div>
          </div>
          <button className="sb-logout" onClick={() => { logout(); nav('/login'); }} title="Sign out">
            <i className="ti ti-logout" />
          </button>
        </div>
      </aside>
      <main className="main">
        <div className="topbar">
          <h1>{title}</h1>
          <div className="spacer" />
          <Link className="btn ghost" to="/notifications"><i className="ti ti-bell" /></Link>
        </div>
        <div className="legacy-banner">
          <i className="ti ti-info-circle" /> Reference wireframe still available:
          <a href="/legacy.html" target="_blank" rel="noreferrer">open original HTML mockup</a>
        </div>
        <div className="page"><Outlet /></div>
      </main>
    </div>
  );
}
