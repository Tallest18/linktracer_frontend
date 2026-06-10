import { useState } from 'react';
import { CopyButton } from './CopyButton';

function timeAgo(iso) {
  if (!iso) return 'never';
  const diff = Date.now() - new Date(iso + 'Z').getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const PALETTE = [
  'bg-em-500', 'bg-violet-500', 'bg-sky-500',
  'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
];

export function CampaignCard({ campaign, onDelete }) {
  const [expanded, setExpanded] = useState(true);

  const links      = [...(campaign.staff_links || [])].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  const maxClicks  = Math.max(...links.map(l => l.clicks || 0), 1);
  const totalClicks = links.reduce((s, l) => s + (l.clicks || 0), 0);
  const top        = links[0];

  return (
    <div className="card animate-fadein">
      {/* Campaign header */}
      <div className="flex items-start justify-between px-5 py-4 border-b border-slate-800">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-slate-100">{campaign.name}</h3>
            {totalClicks > 0 && top && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-em-500/20 text-em-400 px-2 py-0.5 rounded-full">
                🏆 {top.staff_name} leading
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="text-slate-600 flex-shrink-0">
              <path d="M5 6.5a3 3 0 104 0L6 2 5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <a href={campaign.destination_url} target="_blank" rel="noreferrer"
              className="text-xs text-slate-500 hover:text-em-400 transition-colors truncate max-w-xs">
              {campaign.destination_url}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="font-mono text-lg font-bold text-slate-100 tabular-nums leading-none">{totalClicks.toLocaleString()}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">total clicks</p>
          </div>
          <button onClick={() => setExpanded(v => !v)}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={() => onDelete(campaign.id)}
            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5h10M5.5 3.5V2.5h3v1M3 3.5l.7 7.5a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Leaderboard */}
      {expanded && (
        <div className="divide-y divide-slate-800/50">
          {links.length === 0 && (
            <p className="px-5 py-6 text-sm text-slate-600 text-center">No staff links yet.</p>
          )}

          {links.map((link, i) => {
            const pct   = Math.round(((link.clicks || 0) / maxClicks) * 100);
            const isTop = i === 0 && (link.clicks || 0) > 0;
            const barColor = PALETTE[i % PALETTE.length];

            return (
              <div key={link.staff_slug}
                className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${isTop ? 'bg-em-500/[0.04]' : 'hover:bg-slate-800/20'}`}>

                {/* Rank */}
                <div className="flex-shrink-0">
                  {isTop
                    ? <span className="rank-top">{i + 1}</span>
                    : <span className="rank-normal">{i + 1}</span>}
                </div>

                {/* Name + link */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-200">{link.staff_name}</span>
                    {isTop && totalClicks > 0 && (
                      <span className="text-[10px] font-bold bg-em-500/20 text-em-400 px-1.5 py-0.5 rounded uppercase tracking-wide">top</span>
                    )}
                  </div>
                  {/* Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${isTop ? 'bg-em-500' : 'bg-slate-600'}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] text-slate-500 w-7 text-right tabular-nums">{pct}%</span>
                  </div>
                </div>

                {/* Clicks count */}
                <div className="flex-shrink-0 text-right w-14">
                  <p className="font-mono text-sm font-bold text-slate-100 tabular-nums">{(link.clicks || 0).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-600">clicks</p>
                </div>

                {/* Copy link */}
                <div className="flex-shrink-0 flex items-center gap-1">
                  <span className="hidden md:inline font-mono text-[11px] text-slate-600 truncate max-w-[140px]">{link.link}</span>
                  <CopyButton text={link.link} />
                </div>
              </div>
            );
          })}

          {/* Campaign footer */}
          <div className="px-5 py-3 bg-slate-950/30 flex items-center justify-between">
            <p className="text-xs text-slate-600">
              Created {timeAgo(campaign.created_at)}
              {campaign.last_click && ` · Last click ${timeAgo(campaign.last_click)}`}
            </p>
            <p className="text-xs text-slate-600 sm:hidden font-mono font-semibold text-slate-400">{totalClicks} clicks</p>
          </div>
        </div>
      )}
    </div>
  );
}
