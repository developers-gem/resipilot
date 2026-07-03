import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from './lib/auth.jsx';
import { SUPER_ADMIN_NAV } from './lib/superAdminNav.js';

export default function SuperAdminApp() {
  const { user, logout } = useAuth();

  const nav = useNavigate();
  const loc = useLocation();

  const title =
    SUPER_ADMIN_NAV.flatMap(s => s.items).find(
      i => i.to === loc.pathname
    )?.label || 'Super Admin';

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sb-brand">
          <div className="sb-logo">HP</div>

          <div>
            <div className="sb-name">
              Habitat Pilot
            </div>

            <div className="sb-sub">
              Super Admin
            </div>
          </div>
        </div>

        {SUPER_ADMIN_NAV.map(group => (
          <div key={group.section}>
            <div className="sb-sec">
              {group.section}
            </div>

            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  'ni' + (isActive ? ' on' : '')
                }
              >
                <i
                  className={`ti ${item.icon} ni-icon`}
                />

                {item.label}
              </NavLink>
            ))}
          </div>
        ))}

        <div className="sb-user">
          <div className="sb-avatar">
            {(user?.name?.[0] || 'S').toUpperCase()}
          </div>

          <div>
            <div style={{ fontWeight: 600 }}>
              {user?.name || 'Super Admin'}
            </div>

            <div
              style={{
                fontSize: 11,
                color: 'var(--tx3)',
              }}
            >
              Platform Owner
            </div>
          </div>

          <button
            className="sb-logout"
            onClick={() => {
              logout();
              nav('/super-admin/login');
            }}
          >
            <i className="ti ti-logout" />
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <h1>{title}</h1>

          <div className="spacer" />

          <Link
            className="btn ghost"
            to="/notifications"
          >
            <i className="ti ti-bell" />
          </Link>
        </div>

        <div className="page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}