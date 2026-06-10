import { useState } from 'react';
import { useData }           from './hooks/useData';
import { MetricCard }        from './components/MetricCard';
import { StaffPanel }        from './components/StaffPanel';
import { CreateCampaignForm }from './components/CreateCampaignForm';
import { CampaignCard }      from './components/CampaignCard';
import { ConfirmDialog }     from './components/ConfirmDialog';
import { useToast, ToastContainer } from './components/Toast';

// ── Tab nav ──────────────────────────────────────────────────────────────────
function Tab({ label, active, onClick, badge }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
        ${active ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}>
      {label}
      {badge > 0 && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full tabular-nums
          ${active ? 'bg-slate-700 text-slate-300' : 'bg-slate-800 text-slate-500'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const {
    staff, campaigns, stats, loading, error,
    refresh, addStaff, deleteStaff, createCampaign, deleteCampaign,
  } = useData();

  const { toasts, show: toast } = useToast();
  const [tab,     setTab]       = useState('campaigns'); // 'campaigns' | 'staff'
  const [spinning,setSpinning]  = useState(false);
  const [delCamp, setDelCamp]   = useState(null); // campaign id to delete

  async function handleAddStaff(name) {
    await addStaff(name);
    toast(`${name} added`, 'success');
  }

  async function handleDeleteStaff(id) {
    const s = staff.find(x => x.id === id);
    await deleteStaff(id);
    toast(`${s?.name} removed`);
  }

  async function handleCreateCampaign(name, url) {
    const c = await createCampaign(name, url);
    toast(`Campaign "${c.name}" created — ${c.staff_links?.length || 0} links generated`, 'success');
    setTab('campaigns');
  }

  async function handleDeleteCampaign(id) {
    await deleteCampaign(id);
    setDelCamp(null);
    toast('Campaign deleted');
  }

  function handleRefresh() {
    setSpinning(true);
    refresh();
    toast('Refreshed');
    setTimeout(() => setSpinning(false), 700);
  }

  const totalClicks   = stats?.total_clicks    ?? 0;
  const totalStaff    = stats?.total_staff     ?? 0;
  const totalCampaigns= stats?.total_campaigns ?? 0;
  const topPerformer  = stats?.top_performer;
  const topClicks     = stats?.top_clicks      ?? 0;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur border-b border-slate-800/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-em-500 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.4)]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-100 tracking-tight">LinkTracker</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-1">
              <div className="w-1.5 h-1.5 rounded-full bg-em-500 animate-pulse" />
              <span className="text-xs text-slate-600 hidden sm:inline">Live</span>
            </div>
            <button onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200 transition-all">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className={spinning ? 'animate-spin' : ''}>
                <path d="M12 7A5 5 0 112 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 4v3H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero / metrics ─────────────────────────────────────── */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-em-500 mb-1">Dashboard</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-1">Staff link performance</h1>
          <p className="text-sm text-slate-500 mb-6">Paste any URL → generate unique links per staff → track who drives the most clicks</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard label="Total clicks"    value={totalClicks.toLocaleString()} sub="across all campaigns" accent icon="⚡" />
            <MetricCard label="Campaigns"       value={totalCampaigns}               sub="active campaigns"     icon="📣" />
            <MetricCard label="Top performer"   value={topPerformer || '—'}          sub={topClicks > 0 ? `${topClicks.toLocaleString()} clicks` : 'No data yet'} icon="🏆" />
            <MetricCard label="Staff members"   value={totalStaff}                   sub={`${totalStaff} tracking links`} icon="👥" />
          </div>
        </div>
      </div>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">

        {/* Error */}
        {error && (
          <div className="mb-5 flex gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-fadein">
            <span className="text-red-400 flex-shrink-0 mt-0.5">⚠</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Cannot reach backend</p>
              <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Tab bar */}
        <div className="flex items-center gap-1 mb-5 bg-slate-900/50 border border-slate-800 rounded-xl p-1 w-fit">
          <Tab label="Campaigns" active={tab === 'campaigns'} onClick={() => setTab('campaigns')} badge={campaigns.length} />
          <Tab label="New campaign" active={tab === 'new'} onClick={() => setTab('new')} />
          <Tab label="Staff" active={tab === 'staff'} onClick={() => setTab('staff')} badge={staff.length} />
        </div>

        {/* Loading */}
        {loading && !campaigns.length && !staff.length && (
          <div className="flex flex-col items-center gap-3 py-20">
            <div className="w-6 h-6 border-2 border-em-500/30 border-t-em-500 rounded-full animate-spin" />
            <p className="text-xs text-slate-600">Loading…</p>
          </div>
        )}

        {/* ── Campaigns tab ──────────────────────────────────── */}
        {!loading && tab === 'campaigns' && (
          <div className="flex flex-col gap-4 animate-fadein">
            {campaigns.length === 0 ? (
              <div className="card py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📣</span>
                </div>
                <p className="text-sm font-semibold text-slate-300 mb-1">No campaigns yet</p>
                <p className="text-xs text-slate-600 max-w-xs mx-auto mb-4">
                  Create your first campaign — paste any URL and we'll generate unique tracking links for every staff member.
                </p>
                <button onClick={() => setTab('new')}
                  className="px-5 py-2 rounded-lg bg-em-500 hover:bg-em-400 text-white text-sm font-semibold transition-all active:scale-95">
                  Create first campaign
                </button>
              </div>
            ) : (
              campaigns.map(c => (
                <CampaignCard
                  key={c.id}
                  campaign={c}
                  onDelete={id => setDelCamp(id)}
                />
              ))
            )}
          </div>
        )}

        {/* ── New campaign tab ───────────────────────────────── */}
        {!loading && tab === 'new' && (
          <div className="max-w-lg animate-fadein">
            <CreateCampaignForm staffCount={staff.length} onCreate={handleCreateCampaign} />
          </div>
        )}

        {/* ── Staff tab ──────────────────────────────────────── */}
        {!loading && tab === 'staff' && (
          <div className="max-w-lg animate-fadein">
            <StaffPanel staff={staff} onAdd={handleAddStaff} onDelete={handleDeleteStaff} />
          </div>
        )}
      </main>

      {/* Delete campaign confirm */}
      <ConfirmDialog
        confirm={delCamp ? { title: 'Delete campaign?', body: 'All click data for this campaign will be permanently deleted.' } : null}
        onConfirm={() => handleDeleteCampaign(delCamp)}
        onCancel={() => setDelCamp(null)}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
}
