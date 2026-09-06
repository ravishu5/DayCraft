import { useState, useEffect, useCallback, useRef } from 'react';
import type { VersionCheckResult } from '../types/version';
import { VersionService } from '../services/versionService';
import { APP_CURRENT_VERSION } from '../constants/version';

export function useVersionCheck() {
  const [result, setResult] = useState<VersionCheckResult>({
    currentVersion: APP_CURRENT_VERSION,
    isChecking: true,
    isUpdateRequired: false,
    isUpdateAvailable: false,
    config: null,
    error: null
  });

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const checkUpdates = useCallback(async () => {
    // Bail out when a check is already in flight: the initial state is already
    // `isChecking`, so the launch check would otherwise force an extra render.
    setResult(prev => (prev.isChecking && !prev.error ? prev : { ...prev, isChecking: true, error: null }));
    const res = await VersionService.checkForUpdates();
    if (isMountedRef.current) {
      setResult(res);
    }
    return res;
  }, []);

  useEffect(() => {
    // Initial check on launch
    checkUpdates();
  }, [checkUpdates]);

  return { ...result, checkUpdates };
}
