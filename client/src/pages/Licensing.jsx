import { useResource, PageHeader, EmptyState } from '../components/ui.jsx';

export default function Licensing() {
  const { items } = useResource('/licensing');
  return (
    <>
      <PageHeader title="State Licensing" />
      {items.length === 0 ? <EmptyState icon="ti-license" message="No licensing records." /> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Agency</th><th>License #</th><th>Type</th><th>Expires</th><th>Status</th></tr></thead>
          <tbody>{items.map(l => {
            const days = Math.floor((new Date(l.expiresOn) - new Date()) / 86400000);
            return (<tr key={l._id}>
              <td>{l.agency}</td><td>{l.licenseNumber}</td><td>{l.licenseType}</td>
              <td>{l.expiresOn?.slice(0,10)} <span style={{ color: days < 30 ? 'var(--red)' : 'var(--tx3)', fontSize: 11 }}>({days}d)</span></td>
              <td><span className={`badge ${l.status === 'active' ? 'green' : 'red'}`}>{l.status}</span></td>
            </tr>);
          })}</tbody>
        </table></div>
      )}
    </>
  );
}
