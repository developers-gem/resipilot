import { useResource, PageHeader } from '../components/ui.jsx';

export default function Hipaa() {
  const { items } = useResource('/hipaa-log');
  return (
    <>
      <PageHeader title="HIPAA Access Log" />
      <div className="table-wrap"><table>
        <thead><tr><th>When</th><th>Action</th><th>Resource</th><th>Purpose</th><th>IP</th></tr></thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan="5" className="muted">No access events recorded.</td></tr>}
          {items.map(h => (
            <tr key={h._id}>
              <td>{new Date(h.createdAt).toLocaleString()}</td>
              <td><span className="badge blue">{h.action}</span></td>
              <td>{h.resource}</td>
              <td>{h.purpose || '—'}</td>
              <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>{h.ipAddress || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </>
  );
}
