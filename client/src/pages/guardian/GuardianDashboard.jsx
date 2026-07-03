import {
  PageHeader,
  useResource,
  Modal,
  Field,
} from '../../components/guardian-ui.jsx';

export default function GuardianDashboard() {
  const behavioral = useResource('/behavioral-incidents');
  const residents = useResource('/residents');
  const visits = useResource('/visits');
  const messages = useResource('/guardian-messages');

  return (
    <>
      <PageHeader title="Guardian Portal" />

      <div className="grid cols-4 mb-4">
        <div className="card">
          <div className="muted">My Children</div>
          <h2>{residents.items.length}</h2>
        </div>

        <div className="card">
          <div className="muted">Upcoming Visits</div>
          <h2>{visits.items.length}</h2>
        </div>

        <div className="card">
          <div className="muted">Behavior Reports</div>
          <h2>{behavioral.items.length}</h2>
        </div>

        <div className="card">
          <div className="muted">Messages</div>
          <h2>{messages.items.length}</h2>
        </div>
      </div>

      <div className="card">
        <h2>Welcome to the Guardian Portal</h2>

        <p>
          View your child's information, review behavior reports,
          request visits, communicate with staff and access important
          documents.
        </p>
      </div>
    </>
  );
}