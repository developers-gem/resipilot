import { Outlet, NavLink } from 'react-router-dom';
import { useGuardianAuth } from './lib/guardianAuth.jsx';

export default function GuardianLayout() {
  const { guardian, logout } = useGuardianAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">

        <div className="brand">
          <div className="logo">HP</div>

          <div>
            <div
              style={{
                fontWeight: 700,
              }}
            >
              Habitat Pilot
            </div>

            <div className="muted">
              Guardian Portal
            </div>
          </div>
        </div>

        <nav>

          <div className="nav-section">
            Guardian Portal
          </div>

          <NavLink to="/guardian">
            Dashboard
          </NavLink>

          <NavLink to="/guardian/children">
            My Children
          </NavLink>

          <NavLink to="/guardian/behavior">
            Behavior Reports
          </NavLink>

          <NavLink to="/guardian/visits">
            Visits
          </NavLink>

          <NavLink to="/guardian/messages">
            Messages
          </NavLink>

          <div
            style={{
              marginTop: 24,
            }}
          >
            <div className="nav-section">
              Account
            </div>

            <button
              className="btn"
              style={{
                width: '100%',
              }}
              onClick={logout}
            >
              Logout
            </button>
          </div>

        </nav>

        <div
          style={{
            marginTop: 'auto',
            padding: 20,
            borderTop: '1px solid #eee',
          }}
        >
          <strong>
            {guardian?.firstName}{' '}
            {guardian?.lastName}
          </strong>

          <div className="muted">
            {guardian?.email}
          </div>
        </div>

      </aside>

      <main className="content">

        <Outlet />

      </main>
    </div>
  );
}