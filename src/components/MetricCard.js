export function MetricCard({ label, value, sub, accent, icon }) {
  return (
    <div className={`
      relative overflow-hidden rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-200
      ${accent
        ? 'bg-em-500 border-em-400/40 shadow-[0_0_32px_rgba(16,185,129,0.18)]'
        : 'bg-slate-900 border-slate-800 hover:border-slate-700'}
    `}>
      {/* background grid pattern for accent card */}
      {accent && (
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
      )}

      <div className={`flex items-center justify-between relative`}>
        <span className={`text-xs font-semibold tracking-widest uppercase ${accent ? 'text-em-100' : 'text-slate-500'}`}>
          {label}
        </span>
        {icon && (
          <span className={`text-lg ${accent ? 'text-em-200' : 'text-slate-600'}`}>{icon}</span>
        )}
      </div>

      <div className="relative">
        <p className={`text-3xl font-bold leading-none tabular-nums ${accent ? 'text-white' : 'text-slate-100'}`}>
          {value ?? '—'}
        </p>
        {sub && (
          <p className={`text-xs mt-1.5 ${accent ? 'text-em-100' : 'text-slate-500'}`}>{sub}</p>
        )}
      </div>
    </div>
  );
}
