import { useState } from 'react';
import {
  PageHeader,
  Modal,
  Field,
} from '../../components/ui.jsx';

export default function Plans() {
  const [showModal, setShowModal] = useState(false);

  const plans = [
    {
      id: 1,
      name: 'Starter',
      monthly: '$149',
      yearly: '$1,490',
      residents: '10',
      staff: '10',
      storage: '25 GB',
      trial: '14 Days',
      color: '#4F46E5',
      features: [
        'Guardian Portal',
        'Documents',
        'Basic Reports',
        'Email Support',
      ],
    },
    {
      id: 2,
      name: 'Professional',
      monthly: '$299',
      yearly: '$2,990',
      residents: '50',
      staff: 'Unlimited',
      storage: '100 GB',
      trial: '14 Days',
      color: '#059669',
      features: [
        'Everything in Starter',
        'HIPAA',
        'Medication',
        'Behavior Tracking',
        'Reports',
        'Billing',
      ],
    },
    {
      id: 3,
      name: 'Enterprise',
      monthly: 'Custom',
      yearly: 'Custom',
      residents: 'Unlimited',
      staff: 'Unlimited',
      storage: 'Unlimited',
      trial: '30 Days',
      color: '#EA580C',
      features: [
        'Everything',
        'API Access',
        'White Label',
        'SSO',
        'Priority Support',
        'Dedicated Manager',
      ],
    },
  ];

  return (
    <>
      <PageHeader
        title="Subscription Plans"
        actions={
          <button
            className="btn primary"
            onClick={() => setShowModal(true)}
          >
            <i className="ti ti-plus" />
            Create Plan
          </button>
        }
      />

      <div className="grid cols-3">
        {plans.map(plan => (
          <div
            key={plan.id}
            className="card"
          >
            <div
              style={{
                height: 6,
                background: plan.color,
                margin: '-20px -20px 20px',
                borderRadius: '10px 10px 0 0',
              }}
            />

            <h2>{plan.name}</h2>

            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              {plan.monthly}
              {plan.monthly !== 'Custom' && (
                <span
                  style={{
                    fontSize: 14,
                    color: '#666',
                    fontWeight: 400,
                  }}
                >
                  /month
                </span>
              )}
            </div>

            <div className="muted">
              Yearly: {plan.yearly}
            </div>

            <hr style={{ margin: '20px 0' }} />

            <div style={{ lineHeight: 2 }}>
              <div>
                👥 Residents: <strong>{plan.residents}</strong>
              </div>

              <div>
                🧑‍⚕️ Staff: <strong>{plan.staff}</strong>
              </div>

              <div>
                💾 Storage: <strong>{plan.storage}</strong>
              </div>

              <div>
                🎁 Trial: <strong>{plan.trial}</strong>
              </div>
            </div>

            <hr style={{ margin: '20px 0' }} />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {plan.features.map(feature => (
                <div key={feature}>
                  ✅ {feature}
                </div>
              ))}
            </div>

            <button
              className="btn"
              style={{
                width: '100%',
                marginTop: 25,
              }}
            >
              Edit Plan
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <CreatePlanModal
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

function CreatePlanModal({ onClose }) {
  const [plan, setPlan] = useState({
    name: '',
    monthly: '',
    yearly: '',
    residents: '',
    staff: '',
    storage: '',
    trial: '14',
  });

  return (
    <Modal
      title="Create Subscription Plan"
      onClose={onClose}
      footer={
        <>
          <button
            className="btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn primary"
            onClick={onClose}
          >
            Save Plan
          </button>
        </>
      }
    >
      <div className="grid cols-2">
        <Field label="Plan Name">
          <input
            value={plan.name}
            onChange={e =>
              setPlan({
                ...plan,
                name: e.target.value,
              })
            }
          />
        </Field>

        <Field label="Trial Days">
          <input
            type="number"
            value={plan.trial}
            onChange={e =>
              setPlan({
                ...plan,
                trial: e.target.value,
              })
            }
          />
        </Field>
      </div>

      <div className="grid cols-2">
        <Field label="Monthly Price">
          <input
            value={plan.monthly}
            onChange={e =>
              setPlan({
                ...plan,
                monthly: e.target.value,
              })
            }
          />
        </Field>

        <Field label="Yearly Price">
          <input
            value={plan.yearly}
            onChange={e =>
              setPlan({
                ...plan,
                yearly: e.target.value,
              })
            }
          />
        </Field>
      </div>

      <div className="grid cols-3">
        <Field label="Resident Limit">
          <input
            value={plan.residents}
            onChange={e =>
              setPlan({
                ...plan,
                residents: e.target.value,
              })
            }
          />
        </Field>

        <Field label="Staff Limit">
          <input
            value={plan.staff}
            onChange={e =>
              setPlan({
                ...plan,
                staff: e.target.value,
              })
            }
          />
        </Field>

        <Field label="Storage">
          <input
            value={plan.storage}
            onChange={e =>
              setPlan({
                ...plan,
                storage: e.target.value,
              })
            }
          />
        </Field>
      </div>

      <Field label="Included Features">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2,1fr)',
            gap: 12,
          }}
        >
          {[
            'Guardian Portal',
            'Medication',
            'Behavior Tracking',
            'Documents',
            'Reports',
            'Billing',
            'API',
            'White Label',
            'Priority Support',
            'HIPAA',
          ].map(feature => (
            <label
              key={feature}
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <input type="checkbox" />
              {feature}
            </label>
          ))}
        </div>
      </Field>
    </Modal>
  );
}