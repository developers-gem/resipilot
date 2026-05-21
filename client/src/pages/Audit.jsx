import { useResource, PageHeader } from '../components/ui.jsx';

export default function Audit() {
  const { items } = useResource('/audit');
  return (
    <>
      <PageHeader title="Audit Trail" />
      <div className="table-wrap"><table>
        <thead><tr><th>When</th><th>Action</th><th>Table</th><th>Row</th></tr></thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan="4" className="muted">No audit events.</td></tr>}
          {items.map(a => (
            <tr key={a._id}>
              <td>{new Date(a.createdAt).toLocaleString()}</td>
              <td><span className="badge gray">{a.action}</span></td>
              <td>{a.tableName}</td>
              <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>{a.rowId || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </>
  );
}
