import { useState, useCallback, useEffect } from 'react';
import type { AppTab, RoutinePersona } from './types';
import { useTheme } from './hooks/useTheme';
import { useVersionCheck } from './hooks/useVersionCheck';
import { formatDateKey, StorageService } from './services/storageService';
import { Navigation } from './components/Navigation';
import { TodayView } from './components/today/TodayView';
import { RoutinesView } from './components/routines/RoutinesView';
import { ScheduleView } from './components/schedule/ScheduleView';
import { HistoryView } from './components/history/HistoryView';
import { SettingsView } from './components/settings/SettingsView';
import { WelcomeView } from './components/welcome/WelcomeView';
import { InstallModal } from './components/install/InstallModal';
import { UpdateModal } from './components/update/UpdateModal';
import './styles/app.css';

export function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('today');
  const [currentDateStr, setCurrentDateStr] = useState<string>(() => formatDateKey(new Date()));
  const [todayRefreshKey, setTodayRefreshKey] = useState<number>(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
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
      setDeferredPrompt(e);
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
    }
    setActiveTab(tab);
  }, []);

  // Sync to today's date on window focus or app resume
  useEffect(() => {
    const handleSync = () => {
      if (document.visibilityState === 'visible') {
        const today = formatDateKey(new Date());
        setCurrentDateStr((prev) => (activeTab === 'today' ? today : prev));
      }
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
        {activeTab === 'today' && (
          <TodayView
            key={`today-${todayRefreshKey}-${currentDateStr}`}
            currentDateStr={currentDateStr}
            onDateChange={setCurrentDateStr}
          />
        )}
        {activeTab === 'routines' && <RoutinesView key={`routines-${todayRefreshKey}`} />}
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
      </main>

      {/* First-visit or user-invoked Welcome Persona Selector */}
      {showWelcome && (
        <WelcomeView
          onSelectPersona={handleSelectPersona}
          onSkip={handleSkipWelcome}
        />
      )}

      {/* Install to Device / Phone Modal */}
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

      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default App;
