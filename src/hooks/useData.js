import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api/client';

export function useData(pollInterval = 30000) {
  const [staff,     setStaff]     = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [stats,     setStats]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const timer = useRef(null);

  const load = useCallback(async () => {
    try {
      const [s, c, st] = await Promise.all([
        api.getStaff(),
        api.getCampaigns(),
        api.getStats(),
      ]);
      setStaff(s);
      setCampaigns(c);
      setStats(st);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    timer.current = setInterval(load, pollInterval);
    return () => clearInterval(timer.current);
  }, [load, pollInterval]);

  const refresh = useCallback(() => {
    clearInterval(timer.current);
    load();
    timer.current = setInterval(load, pollInterval);
  }, [load, pollInterval]);

  const addStaff = useCallback(async (name) => {
    const created = await api.addStaff(name);
    refresh();
    return created;
  }, [refresh]);

  const deleteStaff = useCallback(async (id) => {
    await api.deleteStaff(id);
    setStaff(prev => prev.filter(s => s.id !== id));
  }, []);

  const createCampaign = useCallback(async (name, url) => {
    const c = await api.createCampaign(name, url);
    refresh();
    return c;
  }, [refresh]);

  const deleteCampaign = useCallback(async (id) => {
    await api.deleteCampaign(id);
    setCampaigns(prev => prev.filter(c => c.id !== id));
  }, []);

  return {
    staff, campaigns, stats, loading, error, refresh,
    addStaff, deleteStaff, createCampaign, deleteCampaign,
  };
}
