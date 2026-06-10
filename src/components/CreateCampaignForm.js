import { useState } from 'react';

export function CreateCampaignForm({ staffCount, onCreate }) {
  const [name, setName] = useState('');
  const [url,  setUrl]  = useState('');
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const n = name.trim();
    const u = url.trim();
    if (!n || !u) { setErr('Both fields are required.'); return; }
    setErr(''); setBusy(true);
    try {
      await onCreate(n, u);
      setName(''); setUrl('');
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800">
        <h2 className="text-sm font-semibold text-slate-100">Create new campaign</h2>
        <p className="text-xs text-slate-500 mt-0.5">Paste any URL — unique tracking links are auto-generated for every staff member</p>
      </div>

      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        {/* Campaign name */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Campaign name</label>
          <input
            value={name}
            onChange={e => { setName(e.target.value); setErr(''); }}
            placeholder="e.g. June Product Launch"
            disabled={busy}
            className="input-base"
            maxLength={80}
          />
        </div>

        {/* Destination URL */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Destination URL</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M6.5 9.5a4.5 4.5 0 006 0l2-2a4.5 4.5 0 00-6.364-6.364l-1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M9.5 6.5a4.5 4.5 0 00-6 0l-2 2a4.5 4.5 0 006.364 6.364l1.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <input
              value={url}
              onChange={e => { setUrl(e.target.value); setErr(''); }}
              placeholder="https://yourwebsite.com/page"
              disabled={busy}
              className="input-base pl-9"
            />
          </div>
          <p className="text-xs text-slate-600 mt-1">All staff tracking links will redirect here</p>
        </div>

        {err && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{err}</p>}

        {staffCount === 0 && (
          <p className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
            ⚠ Add at least one staff member before creating a campaign.
          </p>
        )}

        <button
          type="submit"
          disabled={busy || staffCount === 0 || !name.trim() || !url.trim()}
          className="h-11 rounded-xl bg-em-500 hover:bg-em-400 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2"
        >
          {busy ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating links…</>
          ) : (
            <><span>⚡</span> Generate tracking links for {staffCount} staff</>
          )}
        </button>
      </form>
    </div>
  );
}
