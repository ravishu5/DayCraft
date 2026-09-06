import { useState, useEffect, useCallback } from 'react';
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

  const checkUpdates = useCallback(async () => {
    setResult(prev => ({ ...prev, isChecking: true, error: null }));
    const res = await VersionService.checkForUpdates();
    setResult(res);
    return res;
  }, []);

  useEffect(() => {
    // Initial check on launch
    checkUpdates();
  }, [checkUpdates]);

  return { ...result, checkUpdates };
}
