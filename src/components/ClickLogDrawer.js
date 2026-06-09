import { useClickLog } from '../hooks/useTracker';

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso + 'Z').toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function maskIp(ip) {
  if (!ip) return '—';
  const parts = ip.split('.');
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.*.*`;
  return ip.slice(0, Math.ceil(ip.length / 2)) + '…';
}

function deviceIcon(ua) {
  return /mobile|android|iphone/i.test(ua) ? '📱' : '🖥';
}

export function ClickLogDrawer({ staff, onClose }) {
  const { logs, loading } = useClickLog(staff?.id);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex justify-end animate-fadein"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-lg bg-slate-900 border-l border-slate-800 flex flex-col h-full animate-slidein shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-slate-100">Click log</h2>
            <p className="font-mono text-xs text-em-400 mt-0.5">/ref/{staff?.slug}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-800 mt-0.5"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Summary strip */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center gap-6 flex-shrink-0">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Total clicks</p>
            <p className="font-mono text-xl font-bold text-slate-100 tabular-nums">{(staff?.clicks || 0).toLocaleString()}</p>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Showing</p>
            <p className="font-mono text-xl font-bold text-slate-100 tabular-nums">{loading ? '…' : logs.length}</p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="p-8 text-center text-sm text-slate-500">Loading…</div>
          )}

          {!loading && !logs.length && (
            <div className="p-10 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-slate-500">
                  <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M9 6v3.5l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-400 mb-1">No clicks yet</p>
              <p className="text-xs text-slate-600">Clicks will appear here once the link is shared.</p>
            </div>
          )}

          {!loading && logs.length > 0 && (
            <>
              {/* Desktop table */}
              <table className="w-full hidden sm:table">
                <thead className="sticky top-0 bg-slate-900">
                  <tr className="border-b border-slate-800">
                    {['Time', 'IP', 'Referrer', 'Device'].map(h => (
                      <th key={h} className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 text-xs font-medium text-slate-200 whitespace-nowrap">
                        {formatDateTime(log.timestamp)}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-400">
                        {maskIp(log.ip)}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400 max-w-[140px] truncate" title={log.referrer}>
                        {!log.referrer || log.referrer === 'direct'
                          ? <span className="text-slate-600 italic">direct</span>
                          : (() => { try { return new URL(log.referrer.startsWith('http') ? log.referrer : 'https://' + log.referrer).hostname; } catch { return log.referrer; } })()
                        }
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        {deviceIcon(log.user_agent)} {/mobile|android|iphone/i.test(log.user_agent) ? 'Mobile' : 'Desktop'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile list */}
              <div className="sm:hidden divide-y divide-slate-800/50">
                {logs.map((log, i) => (
                  <div key={i} className="px-5 py-3.5 hover:bg-slate-800/20">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{formatDateTime(log.timestamp)}</p>
                        <p className="font-mono text-[11px] text-slate-500 mt-0.5">{maskIp(log.ip)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-slate-400">{deviceIcon(log.user_agent)}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {!log.referrer || log.referrer === 'direct' ? 'direct' : (() => { try { return new URL(log.referrer.startsWith('http') ? log.referrer : 'https://' + log.referrer).hostname; } catch { return 'unknown'; } })()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
