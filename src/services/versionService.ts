import type { AppVersionConfig, VersionCheckResult } from '../types/version';
import {
  APP_CURRENT_VERSION,
  VERSION_CONFIG_ENDPOINTS,
  VERSION_FETCH_TIMEOUT_MS,
} from '../constants/version';

/**
 * Compare two semver strings (e.g. "1.0.0" vs "1.1.0").
 * Returns:
 *   1 if v1 > v2
 *  -1 if v1 < v2
 *   0 if v1 === v2
 */
export function compareVersions(v1: string, v2: string): number {
  const p1 = (v1 || '0').split('.').map(s => parseInt(s, 10) || 0);
  const p2 = (v2 || '0').split('.').map(s => parseInt(s, 10) || 0);
  const maxLen = Math.max(p1.length, p2.length);

  for (let i = 0; i < maxLen; i++) {
    const num1 = p1[i] ?? 0;
    const num2 = p2[i] ?? 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

export class VersionService {
  /**
   * Fetch the version configuration from available endpoints.
   */
  static async fetchVersionConfig(): Promise<AppVersionConfig | null> {
    const cacheBuster = `t=${Date.now()}`;

    for (const endpoint of VERSION_CONFIG_ENDPOINTS) {
      try {
        const url = endpoint.includes('?') 
          ? `${endpoint}&${cacheBuster}` 
          : `${endpoint}?${cacheBuster}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), VERSION_FETCH_TIMEOUT_MS);

        try {
          const response = await fetch(url, {
            signal: controller.signal,
            cache: 'no-store',
            headers: { Accept: 'application/json' }
          });

          if (response.ok) {
            const config: AppVersionConfig = await response.json();
            if (config && config.minVersion && config.latestVersion) {
              return config;
            }
          }
        } finally {
          // Always release the timer, including on a thrown/aborted request.
          clearTimeout(timeoutId);
        }
      } catch {
        // Try next endpoint
        continue;
      }
    }

    return null;
  }

  /**
   * Check if an update is required or available based on remote config.
   */
  static async checkForUpdates(): Promise<VersionCheckResult> {
    try {
      const config = await this.fetchVersionConfig();

      if (!config) {
        return {
          currentVersion: APP_CURRENT_VERSION,
          isChecking: false,
          isUpdateRequired: false,
          isUpdateAvailable: false,
          config: null,
          error: 'Could not connect to update server'
        };
      }

      // Check if current version is below the minimum required version
      const isBelowMin = compareVersions(APP_CURRENT_VERSION, config.minVersion) < 0;
      // Check if current version is below the latest available version
      const isBelowLatest = compareVersions(APP_CURRENT_VERSION, config.latestVersion) < 0;

      const isUpdateRequired = isBelowMin || (config.forceUpdate === true && isBelowLatest);
      const isUpdateAvailable = isBelowLatest;

      return {
        currentVersion: APP_CURRENT_VERSION,
        isChecking: false,
        isUpdateRequired,
        isUpdateAvailable,
        config
      };
    } catch (err) {
      return {
        currentVersion: APP_CURRENT_VERSION,
        isChecking: false,
        isUpdateRequired: false,
        isUpdateAvailable: false,
        config: null,
        error: err instanceof Error ? err.message : 'Error checking for updates'
      };
    }
  }
}
