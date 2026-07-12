import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createHealthProvider,
  DEFAULT_PROVIDER_SOURCE,
  HealthDashboardSnapshot,
  HealthProviderService,
  HealthProviderSource,
} from '../services/healthProvider';

interface HealthDataContextValue {
  snapshot: HealthDashboardSnapshot | null;
  provider: HealthProviderSource;
  isLoading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  setProvider: (provider: HealthProviderSource) => void;
}

const HealthDataContext = createContext<HealthDataContextValue | undefined>(undefined);

export function HealthDataProvider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<HealthProviderSource>(DEFAULT_PROVIDER_SOURCE);
  const [snapshot, setSnapshot] = useState<HealthDashboardSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const service = useMemo<HealthProviderService>(() => createHealthProvider(provider), [provider]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const nextSnapshot = await service.getDashboardData(7);
      setSnapshot(nextSnapshot);
      setError(nextSnapshot.error);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load health data.');
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<HealthDataContextValue>(
    () => ({ snapshot, provider, isLoading, error, refresh, setProvider }),
    [snapshot, provider, isLoading, error, refresh],
  );

  return <HealthDataContext.Provider value={value}>{children}</HealthDataContext.Provider>;
}

export function useHealthData() {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }

  return context;
}
