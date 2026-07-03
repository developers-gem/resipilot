import { useState } from 'react';

import {
  PageHeader,
  useResource,
  Field,
} from '../../components/guardian-ui.jsx';

import { useGuardianAuth } from '../../lib/guardianAuth.jsx';

export default function GuardianMessages() {
  const { guardian } = useGuardianAuth();

  const messages = useResource(
    guardian?.resident?._id
      ? `/guardian-messages/resident/${guardian.resident._id}`
      : '',
    '/guardian-messages'
  );

  const [messageText, setMessageText] = useState('');

  async function sendMessage() {
    if (!messageText.trim()) {
      return;
    }

    try {
      await messages.create({
        message: messageText,
      });

      setMessageText('');

      messages.refresh();
    } catch (err) {
      console.error(err);
      alert('Unable to send message.');
    }
  }

  return (
    <>
      <PageHeader title="Messages" />

      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '75vh',
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 10,
            marginBottom: 20,
          }}
        >
          {messages.items.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: 40,
                color: '#777',
              }}
            >
              No messages yet.
            </div>
          ) : (
            messages.items.map(msg => (
              <div
                key={msg._id}
                style={{
                  marginBottom: 15,
                  display: 'flex',
                  justifyContent:
                    msg.sender === 'Guardian'
                      ? 'flex-end'
                      : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: 14,
                    borderRadius: 12,
                    background:
                      msg.sender === 'Guardian'
                        ? '#dbeafe'
                        : '#f3f4f6',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    {msg.sender === 'Guardian'
                      ? 'You'
                      : 'Administrator'}
                  </div>

                  <div
                    style={{
                      lineHeight: 1.6,
                      marginBottom: 8,
                    }}
                  >
                    {msg.message}
                  </div>

                  <small
                    style={{
                      color: '#777',
                    }}
                  >
                    {new Date(
                      msg.createdAt
                    ).toLocaleString()}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            borderTop: '1px solid #eee',
            paddingTop: 20,
          }}
        >
          <Field label="Reply">
            <textarea
              rows="4"
              placeholder="Type your message..."
              value={messageText}
              onChange={e =>
                setMessageText(e.target.value)
              }
            />
          </Field>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button
              className="btn primary"
              disabled={!messageText.trim()}
              onClick={sendMessage}
            >
              <i className="ti ti-send" />
              Send Message
            </button>
          </div>
        </div>
      </div>
    </>
  );
}