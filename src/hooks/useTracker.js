import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api/client';

export function useTracker(pollInterval = 30000) {
  const [staff, setStaff]     = useState([]);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const timerRef              = useRef(null);

  const load = useCallback(async () => {
    try {
      const [staffData, statsData] = await Promise.all([api.getStaff(), api.getStats()]);
      setStaff(staffData);
      setStats(statsData);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, pollInterval);
    return () => clearInterval(timerRef.current);
  }, [load, pollInterval]);

  const refresh = useCallback(() => {
    clearInterval(timerRef.current);
    load();
    timerRef.current = setInterval(load, pollInterval);
  }, [load, pollInterval]);

  const addStaff = useCallback(async (name) => {
    const created = await api.addStaff(name);
    refresh();
    return created;
  }, [refresh]);

  const deleteStaff = useCallback(async (id) => {
    await api.deleteStaff(id);
    setStaff(prev => prev.filter(s => s.id !== id));
    refresh();
  }, [refresh]);

  const resetClicks = useCallback(async (id) => {
    await api.resetClicks(id);
    refresh();
  }, [refresh]);

  return { staff, stats, loading, error, refresh, addStaff, deleteStaff, resetClicks };
}

export function useClickLog(staffId) {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!staffId) { setLogs([]); return; }
    setLoading(true);
    api.getClickLog(staffId)
      .then(setLogs).catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [staffId]);

  return { logs, loading };
}
