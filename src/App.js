import { useState } from 'react';
import { useTracker } from './hooks/useTracker';
import { MetricCard }      from './components/MetricCard';
import { AddStaffForm }    from './components/AddStaffForm';
import { StaffTable }      from './components/StaffTable';
import { ClickLogDrawer }  from './components/ClickLogDrawer';
import { useToast, ToastContainer } from './components/Toast';
import './index.css';

/* ── Icons ───────────────────────────────────────────────────── */
function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 8A5.5 5.5 0 112.5 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M13.5 4.5V8H10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── App ─────────────────────────────────────────────────────── */
export default function App() {
  const { staff, stats, loading, error, refresh, addStaff, deleteStaff, resetClicks } = useTracker();
  const { toasts, show: toast } = useToast();
  const [logStaff, setLogStaff] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [spinning, setSpinning] = useState(false);

  async function handleAdd(name) {
    await addStaff(name);
    toast(`${name} added`, 'success');
  }

  async function handleDelete(id) {
    const s = staff.find(x => x.id === id);
    await deleteStaff(id);
    toast(`${s?.name} removed`);
  }

  async function handleReset(id) {
    const s = staff.find(x => x.id === id);
    await resetClicks(id);
    toast(`Clicks reset for ${s?.name}`, 'warn');
  }

  function handleRefresh() {
    setSpinning(true);
    refresh();
    setLastRefresh(new Date());
    toast('Data refreshed');
    setTimeout(() => setSpinning(false), 600);
  }

  const topStaff    = stats?.top_performer;
  const topClicks   = stats?.top_clicks;
  const totalClicks = stats?.total_clicks ?? 0;
  const totalStaff  = stats?.total_staff  ?? 0;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">

      {/* ── Nav ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-em-500 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.4)]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-100 tracking-tight">LinkTracker</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-slate-600">
              Updated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700 transition-all"
            >
              <span className={spinning ? 'animate-spin' : ''}><RefreshIcon /></span>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero band ────────────────────────────────────────── */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-em-500 mb-1">Dashboard</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Staff performance</h1>
            <p className="text-sm text-slate-500 mt-1">Track click performance across all staff tracking links</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <MetricCard
              label="Total clicks"
              value={totalClicks.toLocaleString()}
              sub="across all staff"
              accent
              icon="⚡"
            />
            <MetricCard
              label="Staff members"
              value={totalStaff}
              sub={totalStaff === 1 ? '1 active link' : `${totalStaff} active links`}
              icon="👥"
            />
            <MetricCard
              label="Top performer"
              value={topStaff || '—'}
              sub={topClicks > 0 ? `${topClicks.toLocaleString()} clicks` : 'No data yet'}
              icon="🏆"
            />
            <MetricCard
              label="Avg per staff"
              value={totalStaff > 0 ? Math.round(totalClicks / totalStaff).toLocaleString() : '—'}
              sub="clicks per member"
              icon="📊"
            />
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">

        {/* Error banner */}
        {error && (
          <div className="mb-5 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-fadein">
            <span className="text-red-400 mt-0.5 flex-shrink-0">⚠</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Connection error</p>
              <p className="text-xs text-red-400/70 mt-0.5">{error} — make sure the Flask backend is running on port 5000.</p>
            </div>
          </div>
        )}

        {/* Staff table card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">

          {/* Card header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-slate-100">Staff members</h2>
              {totalStaff > 0 && (
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full tabular-nums">
                  {totalStaff}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-em-500 animate-pulse" />
              <span className="text-xs text-slate-600">Live</span>
            </div>
          </div>

          {/* Add form */}
          <AddStaffForm onAdd={handleAdd} />

          {/* Table / loading */}
          {loading && !staff.length ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-em-500/30 border-t-em-500 rounded-full animate-spin" />
              <p className="text-xs text-slate-600">Loading staff data…</p>
            </div>
          ) : (
            <div className="animate-fadein">
              <StaffTable
                staff={staff}
                onDelete={handleDelete}
                onReset={handleReset}
                onViewLog={setLogStaff}
              />
            </div>
          )}

          {/* Footer note */}
          {staff.length > 0 && (
            <div className="px-5 sm:px-6 py-3 border-t border-slate-800 bg-slate-950/30 flex items-center justify-between">
              <p className="text-xs text-slate-600">
                Links follow pattern:{' '}
                <span className="font-mono text-slate-500">{window.location.origin}/ref/slug</span>
              </p>
              <span className="text-xs text-slate-700">Auto-refreshes every 30s</span>
            </div>
          )}
        </div>
      </main>

      {/* ── Click log drawer ─────────────────────────────────── */}
      {logStaff && (
        <ClickLogDrawer staff={logStaff} onClose={() => setLogStaff(null)} />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
