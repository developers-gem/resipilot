import { useMemo, useState } from 'react';
import {
  useResource,
  PageHeader,
  EmptyState,
} from '../components/ui.jsx';

export default function Hipaa() {
  const { items } = useResource('/hipaa-log');

  const [search, setSearch] =
    useState('');

  const [actionFilter, setActionFilter] =
    useState('all');

  const filtered = useMemo(() => {
    return items.filter(h => {
      const matchesSearch =
        !search ||
        h.userName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        h.description
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesAction =
        actionFilter === 'all' ||
        h.action === actionFilter;

      return (
        matchesSearch &&
        matchesAction
      );
    });
  }, [
    items,
    search,
    actionFilter,
  ]);

  const authorised =
    items.filter(
      i =>
        i.result ===
        'Authorised'
    ).length;

  const blocked =
    items.filter(
      i => i.result === 'Blocked'
    ).length;

  function resultBadge(result) {
    if (
      result === 'Authorised'
    ) {
      return (
        <span className="badge green">
          Authorised
        </span>
      );
    }

    if (result === 'Blocked') {
      return (
        <span className="badge red">
          Blocked
        </span>
      );
    }

    if (result === 'Export') {
      return (
        <span className="badge blue">
          Export
        </span>
      );
    }

    return (
      <span className="badge amber">
        {result || 'OK'}
      </span>
    );
  }

  return (
    <>
      <PageHeader
        title="HIPAA & Privacy"
        actions={
          <div
            style={{
              display: 'flex',
              gap: 12,
            }}
          >
            <button className="btn ghost">
              Export Report
            </button>

            <button className="btn danger">
              Report Breach
            </button>
          </div>
        }
      />

      {/* Compliance Banner */}

      <div
        style={{
          background: '#ECFDF3',
          border:
            '1px solid #BBF7D0',
          borderRadius: 14,
          padding: 16,
          marginBottom: 20,
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <strong>
            HIPAA compliance
            status:
          </strong>{' '}
          Compliant.
          All required
          safeguards active.
        </div>

        <span className="badge green">
          Compliant
        </span>
      </div>

      {/* Summary Cards */}

      <div
        className="grid cols-4"
        style={{
          marginBottom: 20,
        }}
      >
        <div className="card">
          <div
            style={{
              color:
                'var(--tx3)',
              fontSize: 13,
            }}
          >
            Encryption
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              marginTop: 8,
              color: '#15803D',
            }}
          >
            100%
          </div>

          <div
            style={{
              color:
                'var(--tx3)',
            }}
          >
            AES-256 enabled
          </div>
        </div>

        <div className="card">
          <div
            style={{
              color:
                'var(--tx3)',
              fontSize: 13,
            }}
          >
            Open Breaches
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            0
          </div>

          <div
            style={{
              color:
                'var(--tx3)',
            }}
          >
            None reported
          </div>
        </div>

        <div className="card">
          <div
            style={{
              color:
                'var(--tx3)',
              fontSize: 13,
            }}
          >
            PHI Events
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            {items.length}
          </div>

          <div
            style={{
              color:
                'var(--tx3)',
            }}
          >
            Last 30 days
          </div>
        </div>

        <div className="card">
          <div
            style={{
              color:
                'var(--tx3)',
              fontSize: 13,
            }}
          >
            Authorised
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              marginTop: 8,
              color: '#15803D',
            }}
          >
            {authorised}
          </div>

          <div
            style={{
              color:
                'var(--tx3)',
            }}
          >
            Blocked: {blocked}
          </div>
        </div>
      </div>

      {/* Tabs */}

      <div
        style={{
          display: 'flex',
          gap: 24,
          marginBottom: 18,
          borderBottom:
            '1px solid var(--line)',
          paddingBottom: 10,
        }}
      >
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#2563EB',
            fontWeight: 700,
          }}
        >
          PHI Access Log
        </button>

        <button
          style={{
            background: 'none',
            border: 'none',
          }}
        >
          BAA Tracker
        </button>

        <button
          style={{
            background: 'none',
            border: 'none',
          }}
        >
          Safeguards
        </button>

        <button
          style={{
            background: 'none',
            border: 'none',
          }}
        >
          HIPAA Training
        </button>
      </div>

      {/* Filters */}

      <div
        className="card"
        style={{
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1fr 180px',
            gap: 12,
          }}
        >
          <input
            placeholder="Search events..."
            value={search}
            onChange={e =>
              setSearch(
                e.target.value
              )
            }
          />

          <select
            value={actionFilter}
            onChange={e =>
              setActionFilter(
                e.target.value
              )
            }
          >
            <option value="all">
              All Actions
            </option>

            <option value="View">
              View
            </option>

            <option value="Export">
              Export
            </option>

            <option value="Blocked">
              Blocked
            </option>
          </select>
        </div>
      </div>

      {/* Table */}

      {filtered.length === 0 ? (
        <EmptyState
          icon="ti-shield-lock"
          message="No HIPAA access events found."
        />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>
                  Timestamp
                </th>

                <th>Action</th>

                <th>User</th>

                <th>
                  Description
                </th>

                <th>Result</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map(h => (
                <tr key={h._id}>
                  <td>
                    {new Date(
                      h.createdAt
                    ).toLocaleString()}
                  </td>

                  <td>
                    <span className="badge blue">
                      {h.action}
                    </span>
                  </td>

                  <td>
                    <div
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      {h.userName}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color:
                          'var(--tx3)',
                      }}
                    >
                      {h.role}
                    </div>
                  </td>

                  <td>
                    {h.description}
                  </td>

                  <td>
                    {resultBadge(
                      h.result
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}