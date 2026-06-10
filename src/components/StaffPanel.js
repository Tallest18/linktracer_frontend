import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

const PALETTE = [
  ['bg-em-500/15',      'text-em-400'],
  ['bg-violet-500/15',  'text-violet-400'],
  ['bg-sky-500/15',     'text-sky-400'],
  ['bg-amber-500/15',   'text-amber-400'],
  ['bg-rose-500/15',    'text-rose-400'],
  ['bg-cyan-500/15',    'text-cyan-400'],
];

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export function StaffPanel({ staff, onAdd, onDelete }) {
  const [name,    setName]    = useState('');
  const [busy,    setBusy]    = useState(false);
  const [err,     setErr]     = useState('');
  const [confirm, setConfirm] = useState(null);

  async function handleAdd(e) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    setErr(''); setBusy(true);
    try { await onAdd(n); setName(''); }
    catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
        <h2 className="text-sm font-semibold text-slate-100">Staff members</h2>
        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{staff.length}</span>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="flex gap-3 p-4 border-b border-slate-800">
        <div className="flex-1">
          <input value={name} onChange={e => { setName(e.target.value); setErr(''); }}
            placeholder="Staff name…" disabled={busy} className="input-base" maxLength={60} />
          {err && <p className="text-xs text-red-400 mt-1">{err}</p>}
        </div>
        <button type="submit" disabled={busy || !name.trim()}
          className="h-10 px-4 rounded-lg bg-em-500 hover:bg-em-400 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 whitespace-nowrap">
          + Add
        </button>
      </form>

      {/* Staff list */}
      {!staff.length ? (
        <div className="py-10 text-center text-sm text-slate-600">No staff yet — add someone above.</div>
      ) : (
        <ul className="divide-y divide-slate-800/60">
          {staff.map((s, i) => {
            const [bg, fg] = PALETTE[i % PALETTE.length];
            return (
              <li key={s.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-800/30 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${bg} ${fg}`}>
                  {initials(s.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{s.name}</p>
                  <p className="text-xs text-slate-600 font-mono">/ref/{s.slug}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono text-sm font-semibold text-slate-100">{(s.total_clicks || 0).toLocaleString()}</p>
                  <p className="text-xs text-slate-600">total clicks</p>
                </div>
                <button onClick={() => setConfirm({ id: s.id, name: s.name })}
                  className="ml-2 p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-all">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M5.5 3.5V2.5h3v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.5a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        confirm={confirm ? { title: `Remove ${confirm.name}?`, body: 'This removes the staff member from all future campaigns.' } : null}
        onConfirm={() => { onDelete(confirm.id); setConfirm(null); }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
