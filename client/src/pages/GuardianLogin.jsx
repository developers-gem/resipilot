import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useGuardianAuth } from '../lib/guardianAuth.jsx';

export default function GuardianLogin() {
  const { guardian, login } =
    useGuardianAuth();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  if (guardian) {
    return (
      <Navigate
        to="/guardian"
        replace
      />
    );
  }

  async function submit(e) {
    e.preventDefault();

    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <form
        className="card"
        onSubmit={submit}
        style={{
          width: 420,
          margin: '80px auto',
          padding: 30,
        }}
      >
        <h2>Guardian Login</h2>

        <div className="field">
          <label>Email</label>

          <input
            value={email}
            onChange={e =>
              setEmail(
                e.target.value
              )
            }
          />
        </div>

        <div className="field">
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={e =>
              setPassword(
                e.target.value
              )
            }
          />
        </div>

        {error && (
          <div
            style={{
              color: 'red',
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}

        <button className="btn primary">
          Login
        </button>
      </form>
    </div>
  );
}