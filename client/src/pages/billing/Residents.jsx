import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui.jsx';
import { facilityApi } from '../../lib/facilityApi.js';

export default function BillingResidents() {
  const navigate = useNavigate();

  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResidents();
  }, []);

  async function loadResidents() {
    try {
      const data = await facilityApi.get(
        '/billing/residents'
      );

      setResidents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = residents.filter(r => {
    const name =
      `${r.firstName} ${r.lastName}`
        .toLowerCase()
        .trim();

    return name.includes(
      search.toLowerCase().trim()
    );
  });

  return (
    <>
      <PageHeader
        title="Billing Residents"
        actions={
          <button
            className="btn primary"
            onClick={() =>
              navigate('/residents')
            }
          >
            <i className="ti ti-plus" />
            Add Resident
          </button>
        }
      />

      <div
        className="card"
        style={{ marginBottom: 20 }}
      >
        <input
          className="input"
          placeholder="Search resident..."
          value={search}
          onChange={e =>
            setSearch(e.target.value)
          }
        />
      </div>

      <div className="card">
        {loading ? (
          <div
            style={{
              padding: 30,
              textAlign: 'center',
            }}
          >
            Loading residents...
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Resident</th>
                <th>Room</th>
                <th>Medicaid ID</th>
                <th>Primary Payer</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: 'center',
                      padding: 30,
                    }}
                  >
                    No residents found.
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr
                    key={r._id}
                    onClick={() =>
                      navigate(
                        `/billing/residents/${r._id}`
                      )
                    }
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <td>
                      {r.firstName} {r.lastName}
                    </td>

                    <td>
                      {r.roomNumber || '-'}
                    </td>

                    <td>
                      {r.medicaidId || '-'}
                    </td>

                    <td>
                      {r.primaryPayer || '-'}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          r.isActive
                            ? 'green'
                            : 'gray'
                        }`}
                      >
                        {r.isActive
                          ? 'Active'
                          : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}