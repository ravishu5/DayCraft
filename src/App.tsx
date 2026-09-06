import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import type { AppTab, BeforeInstallPromptEvent, RoutinePersona } from './types';
import { useTheme } from './hooks/useTheme';
import { useVersionCheck } from './hooks/useVersionCheck';
import { formatDateKey, StorageService } from './services/storageService';
import { Navigation } from './components/Navigation';
import { TodayView } from './components/today/TodayView';
import { WelcomeView } from './components/welcome/WelcomeView';
import './styles/app.css';

// Only the Today tab is on the first-paint path. Everything below is split into its own
// chunk so the initial bundle does not carry the editor, the schedule grid, or the
// install modal's QR-code library.
const RoutinesView = lazy(() =>
  import('./components/routines/RoutinesView').then((m) => ({ default: m.RoutinesView }))
);
const ScheduleView = lazy(() =>
  import('./components/schedule/ScheduleView').then((m) => ({ default: m.ScheduleView }))
);
const HistoryView = lazy(() =>
  import('./components/history/HistoryView').then((m) => ({ default: m.HistoryView }))
);
const SettingsView = lazy(() =>
  import('./components/settings/SettingsView').then((m) => ({ default: m.SettingsView }))
);
const InstallModal = lazy(() =>
  import('./components/install/InstallModal').then((m) => ({ default: m.InstallModal }))
);
const UpdateModal = lazy(() =>
  import('./components/update/UpdateModal').then((m) => ({ default: m.UpdateModal }))
);

export function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('today');
  const [currentDateStr, setCurrentDateStr] = useState<string>(() => formatDateKey(new Date()));
  const [todayRefreshKey, setTodayRefreshKey] = useState<number>(0);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isUpdateDismissed, setIsUpdateDismissed] = useState(false);

  // Version management and update checking
  const {
    currentVersion,
    isChecking: isCheckingVersion,
    isUpdateRequired,
    isUpdateAvailable,
    config: versionConfig,
    checkUpdates
  } = useVersionCheck();

  // Directly head to homepage if any blueprint was selected earlier or profile exists
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    return !StorageService.hasSelectedPersona();
  });

  const { theme, setTheme } = useTheme();

  // Listen for native PWA install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleSelectPersona = useCallback((persona: RoutinePersona) => {
    StorageService.applyPersonaSchedule(persona, currentDateStr);
    StorageService.setSelectedPersona(persona);
    setTodayRefreshKey((prev) => prev + 1);
    setShowWelcome(false);
  }, [currentDateStr]);

  const handleSkipWelcome = useCallback(() => {
    StorageService.applyPersonaSchedule('general', currentDateStr);
    StorageService.setSelectedPersona('general');
    setTodayRefreshKey((prev) => prev + 1);
    setShowWelcome(false);
  }, [currentDateStr]);

  const handleTabChange = useCallback((tab: AppTab) => {
    if (tab === 'today') {
      // Always reset homescreen to today's actual date
      setCurrentDateStr(formatDateKey(new Date()));
      setTodayRefreshKey((prev) => prev + 1);
    }
    setActiveTab(tab);
  }, []);

  // Sync to today's date on window focus or app resume.
  //
  // This fires on every alt-tab and every app resume, so it only bumps the remount key
  // when the calendar day has actually rolled over. Bumping unconditionally threw away
  // the mounted view (and its scroll position) on every focus.
  useEffect(() => {
    const handleSync = () => {
      if (document.visibilityState !== 'visible' || activeTab !== 'today') return;
      // TodayView is keyed on the date, so setting it is enough to remount on a day
      // rollover; React bails out when the value is unchanged.
      setCurrentDateStr(formatDateKey(new Date()));
    };
    document.addEventListener('visibilitychange', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      document.removeEventListener('visibilitychange', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, [activeTab]);

  return (
    <div className="app-viewport">
      <main className="app-content">
        <Suspense fallback={<div className="route-loading" aria-busy="true" />}>
        {activeTab === 'today' && (
          <TodayView
            key={`today-${todayRefreshKey}-${currentDateStr}`}
            currentDateStr={currentDateStr}
            onDateChange={setCurrentDateStr}
          />
        )}
        {activeTab === 'routines' && (
          <RoutinesView
            key={`routines-${todayRefreshKey}`}
            onRoutineUpdated={() => setTodayRefreshKey((prev) => prev + 1)}
          />
        )}
        {activeTab === 'schedule' && <ScheduleView key={`schedule-${todayRefreshKey}`} />}
        {activeTab === 'history' && (
          <HistoryView
            onSelectDate={(date) => {
              setCurrentDateStr(date);
              setActiveTab('today');
            }}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsView
            theme={theme}
            onThemeChange={setTheme}
            onOpenWelcome={() => setShowWelcome(true)}
            onOpenInstall={() => setIsInstallModalOpen(true)}
            versionConfig={versionConfig}
            isCheckingVersion={isCheckingVersion}
            onCheckUpdates={checkUpdates}
            onDataReset={() => {
              setCurrentDateStr(formatDateKey(new Date()));
              setTodayRefreshKey((prev) => prev + 1);
            }}
          />
        )}
        </Suspense>
      </main>

      {/* First-visit or user-invoked Welcome Persona Selector */}
      {showWelcome && (
        <WelcomeView
          onSelectPersona={handleSelectPersona}
          onSkip={handleSkipWelcome}
        />
      )}

      {/* Install to Device / Phone Modal */}
      <Suspense fallback={null}>
        {isInstallModalOpen && (
          <InstallModal
            onClose={() => setIsInstallModalOpen(false)}
            deferredPrompt={deferredPrompt}
          />
        )}

        {/* App Version Update Modal (Mandatory when below minVersion) */}
        {(isUpdateRequired || (isUpdateAvailable && !isUpdateDismissed)) && (
          <UpdateModal
            currentVersion={currentVersion}
            isUpdateRequired={isUpdateRequired}
            isUpdateAvailable={isUpdateAvailable}
            config={versionConfig}
            isChecking={isCheckingVersion}
            onCheckAgain={checkUpdates}
            onDismiss={isUpdateRequired ? undefined : () => setIsUpdateDismissed(true)}
          />
        )}
      </Suspense>

      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default App;
