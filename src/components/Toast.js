import { useState, useCallback, useRef } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const n = useRef(0);
  const show = useCallback((message, type = 'default') => {
    const id = ++n.current;
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);
  return { toasts, show };
}

const styles = {
  default: 'bg-slate-800 border-slate-700 text-slate-100',
  success: 'bg-em-700 border-em-600 text-white',
  error:   'bg-red-700 border-red-600 text-white',
  warn:    'bg-amber-700 border-amber-600 text-white',
};

export function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`animate-toastin border rounded-xl px-4 py-2.5 text-sm font-medium shadow-2xl max-w-xs ${styles[t.type] || styles.default}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
