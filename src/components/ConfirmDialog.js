export function ConfirmDialog({ confirm, onConfirm, onCancel }) {
  if (!confirm) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadein"
      onClick={onCancel}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fadein"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-slate-100 mb-2">
          {confirm.type === 'delete' ? `Remove ${confirm.name}?` : `Reset ${confirm.name}'s clicks?`}
        </h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          {confirm.type === 'delete'
            ? 'This permanently removes the staff member and their tracking link. This cannot be undone.'
            : 'Their click count will return to zero. Individual click logs are preserved.'}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all active:scale-95 ${
              confirm.type === 'delete'
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-amber-600 hover:bg-amber-500'
            }`}
          >
            {confirm.type === 'delete' ? 'Remove' : 'Reset'}
          </button>
        </div>
      </div>
    </div>
  );
}
