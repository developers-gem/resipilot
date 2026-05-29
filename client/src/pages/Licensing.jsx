import {
  useResource,
  PageHeader,
  EmptyState,
} from '../components/ui.jsx';

export default function Licensing() {
  const { items } = useResource('/licensing');

  const active = items.filter(
    x => x.status === 'active'
  );

  const nextRenewal = items
    .filter(x => x.expiresOn)
    .sort(
      (a, b) =>
        new Date(a.expiresOn) -
        new Date(b.expiresOn)
    )[0];

  const daysLeft = nextRenewal
    ? Math.floor(
        (new Date(nextRenewal.expiresOn) -
          new Date()) /
          86400000
      )
    : 0;

  return (
    <>
      <PageHeader
        title="State licensing"
        actions={
          <div
            style={{
              display: 'flex',
              gap: 12,
            }}
          >
            <button className="btn ghost">
              Export all
            </button>

            <button className="btn primary">
              Submit to CDSS
            </button>
          </div>
        }
      />

      <div
        style={{
          background: '#ECFDF3',
          border: '1px solid #BBF7D0',
          borderRadius: 14,
          padding: 16,
          marginBottom: 20,
          color: '#166534',
        }}
      >
        <strong>
          {active.length} facilities licensed
          and in good standing.
        </strong>
      </div>

      <div
        className="grid cols-4"
        style={{
          marginBottom: 20,
        }}
      >
        <div className="card">
          <div className="muted">
            Facilities licensed
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#15803D',
            }}
          >
            {active.length}/{items.length}
          </div>

          <div className="muted">
            All in good standing
          </div>
        </div>

        <div className="card">
          <div className="muted">
            Next renewal
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#D97706',
            }}
          >
            {daysLeft}d
          </div>

          <div className="muted">
            {nextRenewal?.facility?.name}
          </div>
        </div>

        <div className="card">
          <div className="muted">
            Reports
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            {items.length}
          </div>

          <div className="muted">
            Submitted records
          </div>
        </div>

        <div className="card">
          <div className="muted">
            Violations
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#15803D',
            }}
          >
            0
          </div>

          <div className="muted">
            Clean record
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="ti-license"
          message="No licensing records"
        />
      ) : (
        <>
          {items.map(l => {
            const days = Math.floor(
              (new Date(l.expiresOn) -
                new Date()) /
                86400000
            );

            return (
              <div
                key={l._id}
                className="card"
                style={{
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 18,
                      }}
                    >
                      {l.facility?.name ||
                        'Facility'}
                    </div>

                    <div
                      className="muted"
                      style={{
                        marginTop: 4,
                      }}
                    >
                      License #
                      {l.licenseNumber}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                    }}
                  >
                    <span className="badge green">
                      Licensed
                    </span>

                    <button className="btn primary sm">
                      Start renewal
                    </button>

                    <button className="btn ghost sm">
                      View inspection
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(4,1fr)',
                    marginTop: 20,
                    gap: 20,
                  }}
                >
                  <div>
                    <div className="muted">
                      Type
                    </div>

                    <strong>
                      {l.licenseType}
                    </strong>
                  </div>

                  <div>
                    <div className="muted">
                      Agency
                    </div>

                    <strong>
                      {l.agency}
                    </strong>
                  </div>

                  <div>
                    <div className="muted">
                      Expires
                    </div>

                    <strong>
                      {l.expiresOn?.slice(
                        0,
                        10
                      )}
                    </strong>
                  </div>

                  <div>
                    <div className="muted">
                      Days left
                    </div>

                    <strong>
                      {days}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="card">
            <h3>
              Compliance checklist
            </h3>

            <div
              style={{
                marginTop: 16,
              }}
            >
              <div>
                ✓ Staffing ratios maintained
              </div>

              <div>
                ✓ CPR certifications current
              </div>

              <div>
                ✓ Fire inspection completed
              </div>

              <div>
                ⏳ Policy manual review
              </div>

              <div>
                ⏳ Submit quarterly report
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}