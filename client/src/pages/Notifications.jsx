import { useResource, PageHeader } from '../components/ui.jsx';

export default function Notifications() {
  const { items, update, refresh } = useResource('/notifications');
  return (
    <>
      <PageHeader title="Notifications" actions={
        <button className="btn" onClick={async () => {
          for (const n of items.filter(n => !n.isRead)) await update(n._id, { isRead: true, readAt: new Date() });
          refresh();
        }}><i className="ti ti-check" /> Mark all read</button>
      } />
      <div className="table-wrap">
        <table><thead><tr><th>Type</th><th>Title</th><th>Message</th><th>When</th></tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan="4" className="muted">No notifications.</td></tr>}
            {items.map(n => (
              <tr key={n._id} style={{ opacity: n.isRead ? 0.5 : 1 }}>
                <td><span className={`badge ${n.type === 'alert' ? 'red' : n.type === 'warning' ? 'amber' : 'blue'}`}>{n.type}</span></td>
                <td>{n.title}</td>
                <td>{n.body}</td>
                <td>{new Date(n.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
