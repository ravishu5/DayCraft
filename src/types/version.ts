export interface AppVersionConfig {
  minVersion: string;
  latestVersion: string;
  versionCode?: number;
  minVersionCode?: number;
  forceUpdate?: boolean;
  title?: string;
  message?: string;
  releaseNotes?: string[];
  downloadUrl: string;
}

export interface VersionCheckResult {
  currentVersion: string;
  isChecking: boolean;
  isUpdateRequired: boolean;
  isUpdateAvailable: boolean;
  config: AppVersionConfig | null;
  error?: string | null;
}
