import { useResource, PageHeader, EmptyState } from '../components/ui.jsx';

export default function Training() {
  const certs = useResource('/certifications');
  const courses = useResource('/training-courses');
  return (
    <>
      <PageHeader title="Training & Certifications" />
      <h3 className="section-title">Staff certifications</h3>
      {certs.items.length === 0 ? <EmptyState icon="ti-certificate" message="No certifications recorded." /> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Cert</th><th>Issued</th><th>Expires</th><th>Status</th></tr></thead>
          <tbody>{certs.items.map(c => (
            <tr key={c._id}>
              <td>{c.certName}</td><td>{c.issuedOn?.slice(0,10)}</td><td>{c.expiresOn?.slice(0,10)}</td>
              <td><span className={`badge ${c.status === 'valid' ? 'green' : c.status === 'expiring' ? 'amber' : 'red'}`}>{c.status}</span></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
      <h3 className="section-title">Available courses</h3>
      <div className="grid cols-3">
        {courses.items.length === 0 && <div className="empty" style={{ gridColumn: '1/-1' }}>No courses configured.</div>}
        {courses.items.map(c => (
          <div key={c._id} className="card">
            <div style={{ fontWeight: 600 }}>{c.name}</div>
            <div style={{ color: 'var(--tx3)', fontSize: 11, marginTop: 4 }}>Valid {c.validMonths} months</div>
            <div style={{ marginTop: 6, fontSize: 12 }}>{c.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}
