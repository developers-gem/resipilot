import { Link, Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useGuardianAuth } from './lib/guardianAuth.jsx';
import { GUARDIAN_NAV } from './lib/guardianNav.js';

export default function GuardianApp() {
const { guardian, logout } = useGuardianAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const title = GUARDIAN_NAV.flatMap(s => s.items).find(i => i.to === loc.pathname)?.label
              || (loc.pathname.startsWith('/residents/') ? 'Resident Detail' : 'Habitat Pilot');

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sb-brand">
          <div className="sb-logo">HP</div>
          <div>
            <div className="sb-name">Habitat Pilot</div>
            <div className="sb-sub">  Guardian Portal
</div>
          </div>
        </div>
        {GUARDIAN_NAV.map(group => (
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
<div className="sb-avatar">
  {(guardian?.firstName?.[0] || 'U').toUpperCase()}
</div>          <div>
            <div style={{ fontWeight: 500 }}>{`${guardian?.firstName} ${guardian?.lastName}`}</div>
            <div style={{ color: 'var(--tx3)', fontSize: 10 }}>{guardian?.relationship}</div>
          </div>
          <button className="sb-logout" onClick={() => { logout(); nav('/guardian-login'); }} title="Sign out">
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
        
        <div className="page"><Outlet /></div>
      </main>
    </div>
  );
}
