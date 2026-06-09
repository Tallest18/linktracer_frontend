import { useState, useCallback, useRef } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const show = useCallback((message, type = 'default') => {
    const id = ++counter.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  return { toasts, show };
}

const typeStyles = {
  default: 'bg-slate-800 border-slate-700 text-slate-100',
  success: 'bg-em-700 border-em-600 text-white',
  error:   'bg-red-700 border-red-600 text-white',
  warn:    'bg-amber-700 border-amber-600 text-white',
};

export function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`animate-toastin border rounded-lg px-4 py-2.5 text-sm font-medium shadow-xl max-w-xs ${typeStyles[t.type] || typeStyles.default}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
