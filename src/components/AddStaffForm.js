import { useState } from 'react';

export function AddStaffForm({ onAdd }) {
  const [name, setName]     = useState('');
  const [busy, setBusy]     = useState(false);
  const [err,  setErr]      = useState('');

  async function submit(e) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    setErr(''); setBusy(true);
    try {
      await onAdd(n);
      setName('');
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 p-5 border-b border-slate-800">
      <div className="flex-1 flex flex-col gap-1">
        <input
          value={name}
          onChange={e => { setName(e.target.value); setErr(''); }}
          placeholder="Enter staff name…"
          disabled={busy}
          maxLength={60}
          className="
            h-10 px-4 rounded-lg bg-slate-800 border border-slate-700 text-slate-100
            placeholder:text-slate-500 text-sm outline-none w-full
            focus:border-em-500 focus:ring-1 focus:ring-em-500/30
            transition-all duration-150 disabled:opacity-50
          "
        />
        {err && <span className="text-xs text-red-400">{err}</span>}
      </div>
      <button
        type="submit"
        disabled={busy || !name.trim()}
        className="
          h-10 px-5 rounded-lg bg-em-500 hover:bg-em-400 active:scale-95
          text-white text-sm font-semibold whitespace-nowrap
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-150 shadow-[0_0_16px_rgba(16,185,129,0.25)]
        "
      >
        {busy ? 'Adding…' : '+ Add staff'}
      </button>
    </form>
  );
}
