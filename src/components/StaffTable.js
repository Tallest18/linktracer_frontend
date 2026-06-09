import { useState } from 'react';
import { trackingUrl } from '../api/client';
import { CopyButton }  from './CopyButton';
import { ConfirmDialog } from './ConfirmDialog';

/* Avatar colour pool — slate-950 base so they read well in the dark UI */
const PALETTE = [
  { bg: 'bg-em-500/15',   text: 'text-em-400'    },
  { bg: 'bg-violet-500/15', text: 'text-violet-400' },
  { bg: 'bg-sky-500/15',  text: 'text-sky-400'   },
  { bg: 'bg-amber-500/15',text: 'text-amber-400' },
  { bg: 'bg-rose-500/15', text: 'text-rose-400'  },
  { bg: 'bg-cyan-500/15', text: 'text-cyan-400'  },
  { bg: 'bg-fuchsia-500/15', text: 'text-fuchsia-400' },
];

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function timeAgo(iso) {
  if (!iso) return 'never';
  const diff = Date.now() - new Date(iso + 'Z').getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/* ── Desktop row ─────────────────────────────────────────────── */
function DesktopRow({ s, rank, maxClicks, onViewLog, onDelete, onReset }) {
  const pal  = PALETTE[rank % PALETTE.length];
  const pct  = Math.round(((s.clicks || 0) / maxClicks) * 100);
  const isTop = rank === 0 && (s.clicks || 0) > 0;
  const url  = trackingUrl(s.slug);

  return (
    <tr className={`border-b border-slate-800/60 transition-colors ${isTop ? 'bg-em-500/[0.04]' : 'hover:bg-slate-800/30'}`}>
      {/* Rank */}
      <td className="py-4 pl-6 pr-2 w-12">
        {isTop
          ? <span className="rank-top">{rank + 1}</span>
          : <span className="rank-normal">{rank + 1}</span>}
      </td>

      {/* Name */}
      <td className="py-4 px-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${pal.bg} ${pal.text}`}>
            {initials(s.name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              {s.name}
              {isTop && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-em-500/20 text-em-400 px-1.5 py-0.5 rounded">
                  top
                </span>
              )}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Last click: {timeAgo(s.last_click)}</p>
          </div>
        </div>
      </td>

      {/* Tracking link */}
      <td className="py-4 px-3">
        <div className="flex items-center">
          <span className="link-pill">/ref/{s.slug}</span>
          <CopyButton text={url} label="tracking link" />
        </div>
      </td>

      {/* Performance bar */}
      <td className="py-4 px-3 w-48">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${isTop ? 'bg-em-500' : 'bg-slate-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 w-8 text-right tabular-nums">{pct}%</span>
        </div>
      </td>

      {/* Clicks */}
      <td className="py-4 px-3 text-right">
        <span className="font-mono text-base font-semibold text-slate-100 tabular-nums">
          {(s.clicks || 0).toLocaleString()}
        </span>
      </td>

      {/* Actions */}
      <td className="py-4 pl-3 pr-6">
        <div className="flex items-center gap-1.5 justify-end">
          <button onClick={() => onViewLog(s)} className="btn-ghost">Log</button>
          <button onClick={() => onReset(s)}   className="btn-ghost">Reset</button>
          <button onClick={() => onDelete(s)}  className="btn-ghost btn-danger">Remove</button>
        </div>
      </td>
    </tr>
  );
}

/* ── Mobile card row ─────────────────────────────────────────── */
function MobileCard({ s, rank, maxClicks, onViewLog, onDelete, onReset }) {
  const pal  = PALETTE[rank % PALETTE.length];
  const pct  = Math.round(((s.clicks || 0) / maxClicks) * 100);
  const isTop = rank === 0 && (s.clicks || 0) > 0;
  const url  = trackingUrl(s.slug);

  return (
    <div className={`p-4 border-b border-slate-800/60 ${isTop ? 'bg-em-500/[0.04]' : ''}`}>
      <div className="flex items-start gap-3">
        {/* rank + avatar */}
        <div className="flex flex-col items-center gap-1.5">
          {isTop
            ? <span className="rank-top text-[10px]">{rank + 1}</span>
            : <span className="rank-normal text-[10px]">{rank + 1}</span>}
        </div>

        <div className="flex-1 min-w-0">
          {/* name + badge */}
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${pal.bg} ${pal.text}`}>
              {initials(s.name)}
            </div>
            <span className="text-sm font-semibold text-slate-100 truncate">{s.name}</span>
            {isTop && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-em-500/20 text-em-400 px-1.5 py-0.5 rounded flex-shrink-0">
                top
              </span>
            )}
          </div>

          {/* link */}
          <div className="flex items-center mb-3">
            <span className="link-pill text-[11px]">/ref/{s.slug}</span>
            <CopyButton text={url} />
          </div>

          {/* bar + clicks */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${isTop ? 'bg-em-500' : 'bg-slate-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono text-sm font-semibold text-slate-100 tabular-nums">
              {(s.clicks || 0).toLocaleString()}
            </span>
          </div>

          {/* actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => onViewLog(s)} className="btn-ghost text-[11px]">View log</button>
            <button onClick={() => onReset(s)}   className="btn-ghost text-[11px]">Reset</button>
            <button onClick={() => onDelete(s)}  className="btn-ghost btn-danger text-[11px]">Remove</button>
            <span className="ml-auto text-[11px] text-slate-600">{timeAgo(s.last_click)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────── */
export function StaffTable({ staff, onDelete, onReset, onViewLog }) {
  const [confirm, setConfirm] = useState(null);

  const sorted    = [...staff].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  const maxClicks = Math.max(...sorted.map(s => s.clicks || 0), 1);

  function handleConfirm() {
    if (!confirm) return;
    if (confirm.type === 'delete') onDelete(confirm.id);
    else onReset(confirm.id);
    setConfirm(null);
  }

  if (!staff.length) {
    return (
      <div className="py-16 px-6 text-center animate-fadein">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-slate-500">
            <circle cx="11" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M4 18c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-300 mb-1">No staff members yet</p>
        <p className="text-xs text-slate-600 max-w-xs mx-auto">
          Add your first staff member above and we'll generate a unique tracking link for them.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table — hidden on mobile */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              {['#', 'Name', 'Tracking link', 'Performance', 'Clicks', ''].map((h, i) => (
                <th
                  key={i}
                  className={`py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500
                    ${i === 0 ? 'pl-6 pr-2 text-center' : 'px-3 text-left'}
                    ${i === 4 ? 'text-right' : ''}
                    ${i === 5 ? 'pl-3 pr-6' : ''}
                  `}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <DesktopRow
                key={s.id} s={s} rank={i} maxClicks={maxClicks}
                onViewLog={onViewLog}
                onDelete={s => setConfirm({ type: 'delete', id: s.id, name: s.name })}
                onReset={s  => setConfirm({ type: 'reset',  id: s.id, name: s.name })}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards — hidden on desktop */}
      <div className="sm:hidden divide-y divide-slate-800/60">
        {sorted.map((s, i) => (
          <MobileCard
            key={s.id} s={s} rank={i} maxClicks={maxClicks}
            onViewLog={onViewLog}
            onDelete={s => setConfirm({ type: 'delete', id: s.id, name: s.name })}
            onReset={s  => setConfirm({ type: 'reset',  id: s.id, name: s.name })}
          />
        ))}
      </div>

      <ConfirmDialog
        confirm={confirm}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
}
