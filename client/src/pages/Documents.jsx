import { useResource, PageHeader, EmptyState } from '../components/ui.jsx';

export default function Documents() {
  const { items, remove } = useResource('/documents');
  return (
    <>
      <PageHeader title="Documents Vault" actions={
        <button className="btn primary"><i className="ti ti-upload" /> Upload</button>
      } />
      {items.length === 0 ? <EmptyState icon="ti-folder-off" message="No documents uploaded." /> : (
        <div className="table-wrap">
          <table><thead><tr><th>Title</th><th>Category</th><th>Confidential</th><th>Uploaded</th><th></th></tr></thead>
            <tbody>{items.map(d => (
              <tr key={d._id}>
                <td><a href={d.fileUrl} target="_blank" rel="noreferrer">{d.title}</a></td>
                <td><span className="badge gray">{d.category}</span></td>
                <td>{d.isConfidential ? '🔒' : '—'}</td>
                <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                <td><button className="btn sm ghost" onClick={() => remove(d._id)}><i className="ti ti-trash" /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}
