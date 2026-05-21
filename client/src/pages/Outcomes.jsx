import { useResource, PageHeader } from '../components/ui.jsx';

export default function Outcomes() {
  const { items } = useResource('/outcome-metrics');
  const grouped = {};
  items.forEach(m => { (grouped[m.metricKey] = grouped[m.metricKey] || []).push(m); });
  return (
    <>
      <PageHeader title="Outcome Metrics" />
      <div className="grid cols-3">
        {Object.keys(grouped).length === 0 && <div className="empty" style={{ gridColumn: '1/-1' }}>No metrics tracked yet.</div>}
        {Object.entries(grouped).map(([key, vals]) => {
          const latest = vals[0];
          return (
            <div key={key} className="card">
              <h3>{key.replace(/_/g, ' ')}</h3>
              <div className="stat" style={{ border: 0, padding: 0 }}>
                <div className="value">{latest.metricValue}</div>
                <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                  {latest.periodStart?.slice(0,10)} → {latest.periodEnd?.slice(0,10)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
