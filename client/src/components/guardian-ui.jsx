// Lightweight UI helpers shared by all pages.
import { useEffect, useState } from 'react';
import { guardianApi as api } from '../lib/guardianApi.js';

// Generic list page hook: GET /resource and expose CRUD helpers.
export function useResource(getPath, postPath = getPath) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  async function refresh() {
    if (!getPath) return;

    setLoading(true);

    try {
      setItems(await api.get(getPath));
      setErr(null);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

 useEffect(() => {
  if (!getPath) {
    setItems([]);
    setLoading(false);
    return;
  }

  refresh();

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [getPath]);

  return {
    items,
    loading,
    err,
    refresh,

    create: async body => {
      await api.post(postPath, body);
      refresh();
    },

    update: async (id, body) => {
      await api.patch(`${postPath}/${id}`, body);
      refresh();
    },

    remove: async id => {
      if (confirm('Delete this item?')) {
        await api.delete(`${postPath}/${id}`);
        refresh();
      }
    },
  };
}

export function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
        style={{
          width: '95vw',
          maxWidth: '1000px',
          height: '80vh',
          maxHeight: '94vh',
          background: '#fff',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div className="modal-head">
          <h2>{title}</h2>

          <button className="btn ghost sm" onClick={onClose}>
            <i className="ti ti-x" />
          </button>
        </div>

        <div
          className="modal-body"
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: 4
          }}
        >
          {children}
        </div>

        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}



export function Field({ label, children }) {
  return <div className="field"><label>{label}</label>{children}</div>;
}

export function EmptyState({ icon = 'ti-database-off', message = 'Nothing here yet.', children }) {
  return (
    <div className="empty">
      <i className={`ti ${icon}`} style={{ fontSize: 32, display: 'block', marginBottom: 8 }} />
      <div>{message}</div>
      {children && <div style={{ marginTop: 12 }}>{children}</div>}
    </div>
  );
}

export function PageHeader({ title, actions }) {
  return (
    <div className="toolbar">
      <div style={{ fontSize: 18, fontWeight: 600 }}>{title}</div>
      <div className="spacer" />
      {actions}
    </div>
  );
}
