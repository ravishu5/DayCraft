export const APP_CURRENT_VERSION = '1.0.0';
export const APP_BUILD_NUMBER = 2;

export const RELEASES_PAGE_URL = 'https://github.com/ravishu5/DayCraft/releases';

/**
 * Direct APK download. GitHub's `/releases/latest/download/<asset>` path redirects to
 * whichever release is current, so this does not need bumping each version — it only
 * depends on the asset keeping its filename.
 *
 * This used to point at `/DayCraft.apk`, a gitignored file that exists only on the
 * maintainer's machine, so the button 404'd on any deploy built from a clean clone.
 */
export const LATEST_APK_URL = `${RELEASES_PAGE_URL}/latest/download/DayCraft-release.apk`;

// Milliseconds to wait on a single version-config endpoint before moving on.
export const VERSION_FETCH_TIMEOUT_MS = 3000;

/**
 * Config URLs to check in order of priority.
 *
 * Dev-only hosts are stripped from production builds: a shipped APK or PWA has no
 * reason to probe localhost or a hardcoded LAN address, and doing so both stalled
 * startup (one timeout per unreachable host) and let anything answering on that
 * LAN address dictate `forceUpdate` / `downloadUrl`.
 */
export const VERSION_CONFIG_ENDPOINTS: readonly string[] = import.meta.env.DEV
  ? ['/version-config.json']
  : [
      'https://raw.githubusercontent.com/ravishu5/DayCraft/main/version-config.json',
      // Bundled copy: always resolves, so the app degrades gracefully offline.
      '/version-config.json',
    ];
