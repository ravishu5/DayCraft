import React, { useEffect, useState } from 'react';
import { Sun, Moon, Monitor, Check, RefreshCw, Smartphone, Download } from 'lucide-react';
import type { ThemeMode, RoutinePersona } from '../../types';
import { StorageService } from '../../services/storageService';
import { APP_CURRENT_VERSION } from '../../constants/version';
import type { AppVersionConfig } from '../../types/version';

const CHECKING_MESSAGE = 'Checking latest version config...';

interface SettingsViewProps {
  theme: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  onOpenWelcome?: () => void;
  onOpenInstall?: () => void;
  onDataReset: () => void;
  versionConfig?: AppVersionConfig | null;
  isCheckingVersion?: boolean;
  onCheckUpdates?: () => Promise<unknown> | void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  theme,
  onThemeChange,
  onOpenWelcome,
  onOpenInstall,
  onDataReset,
  versionConfig,
  isCheckingVersion = false,
  onCheckUpdates,
}) => {
  const [presetStatus, setPresetStatus] = useState<string | null>(null);
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);
  const activePersona = StorageService.getSelectedPersona();

  const handleApplyPersona = (persona: RoutinePersona) => {
    // Updates both the recurring schedule, today's active routine blocks, and purges routines of other blueprints
    StorageService.applyPersonaSchedule(persona);
    onDataReset();

    let msg = '💼 Corporate blueprint applied! Routines filtered to corporate only.';
    if (persona === 'student') msg = '🎓 Student blueprint applied! Routines filtered to student only.';
    if (persona === 'govt_aspirant') msg = '🏛️ Govt Exam Aspirant blueprint applied! Routines filtered to self-study only.';
    if (persona === 'general') msg = '✨ General Lifestyle blueprint applied! Routines filtered to general flow.';

    setPresetStatus(msg);
  };

  // Auto-dismiss transient banners, cancelling the timer if the view unmounts first.
  useEffect(() => {
    if (!presetStatus) return;
    const id = setTimeout(() => setPresetStatus(null), 3500);
    return () => clearTimeout(id);
  }, [presetStatus]);

  useEffect(() => {
    if (!updateFeedback || updateFeedback === CHECKING_MESSAGE) return;
    const id = setTimeout(() => setUpdateFeedback(null), 3000);
    return () => clearTimeout(id);
  }, [updateFeedback]);

  const handleCheckUpdates = () => {
    if (!onCheckUpdates) return;
    setUpdateFeedback(CHECKING_MESSAGE);
    // Report the real outcome instead of a fixed 1.2s delay that claimed success
    // regardless of whether the check actually succeeded.
    Promise.resolve(onCheckUpdates()).then(
      () => setUpdateFeedback('Version check complete!'),
      () => setUpdateFeedback('Could not reach the update server.')
    );
  };

  return (
    <div className="settings-view">
      <header className="view-header">
        <div className="view-header-top">
          <div>
            <div className="date-eyebrow">PREFERENCES</div>
            <h1 className="view-title">Settings</h1>
          </div>
        </div>
      </header>

      {/* Theme Mode */}
      <div
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          marginBottom: '1.25rem',
        }}
      >
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem' }}>Appearance</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Select your visual theme preference.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{
              padding: '0.65rem 0.5rem',
              flexDirection: 'column',
              gap: '0.35rem',
              border: theme === 'light' ? '2px solid var(--text-primary)' : '1px solid var(--card-border)',
            }}
            onClick={() => onThemeChange('light')}
          >
            <Sun size={18} />
            <span style={{ fontSize: '0.78rem' }}>Light</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{
              padding: '0.65rem 0.5rem',
              flexDirection: 'column',
              gap: '0.35rem',
              border: theme === 'dark' ? '2px solid var(--text-primary)' : '1px solid var(--card-border)',
            }}
            onClick={() => onThemeChange('dark')}
          >
            <Moon size={18} />
            <span style={{ fontSize: '0.78rem' }}>Dark</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{
              padding: '0.65rem 0.5rem',
              flexDirection: 'column',
              gap: '0.35rem',
              border: theme === 'system' ? '2px solid var(--text-primary)' : '1px solid var(--card-border)',
            }}
            onClick={() => onThemeChange('system')}
          >
            <Monitor size={18} />
            <span style={{ fontSize: '0.78rem' }}>System</span>
          </button>
        </div>
      </div>

      {/* Lifestyle Blueprints (Corporate vs Student vs Govt Aspirant) */}
      <div
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          marginBottom: '1.25rem',
        }}
      >
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem' }}>Lifestyle Blueprints</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          One-tap configure today's routines and your weekly schedule with tailored templates.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {[
            {
              id: 'govt_aspirant' as const,
              emoji: '🏛️',
              title: 'Govt Exam Aspirant (Self-Study)',
              desc: 'Full-time self-study: Editorial notes, GS Slot 1, Optional Slot 2, Timed Mocks & Daily Audit',
              border: 'rgba(217, 119, 6, 0.4)',
              badgeColor: '#d97706',
            },
            {
              id: 'corporate' as const,
              emoji: '💼',
              title: 'Corporate Worker Blueprint',
              desc: 'Office commute, WFH focus, syncs, post-work gym & executive wind-downs',
              border: 'rgba(2, 132, 199, 0.35)',
              badgeColor: '#0284c7',
            },
            {
              id: 'student' as const,
              emoji: '🎓',
              title: 'College / School Student Blueprint',
              desc: 'Campus lectures, lab sessions, library sprints & assignment deadlines',
              border: 'rgba(147, 51, 234, 0.35)',
              badgeColor: '#9333ea',
            },
            {
              id: 'general' as const,
              emoji: '✨',
              title: 'General Lifestyle Blueprint',
              desc: 'Mindful fresh start, productive midday focus, evening flow and sleep reset',
              border: 'rgba(16, 185, 129, 0.35)',
              badgeColor: '#10b981',
            },
          ].map((item) => {
            const isActive = activePersona === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className="btn-secondary"
                style={{
                  justifyContent: 'space-between',
                  padding: '0.8rem 1rem',
                  border: isActive ? `2px solid ${item.badgeColor}` : `1px solid ${item.border}`,
                  background: isActive ? 'var(--card-bg)' : 'var(--bg-surface)',
                  boxShadow: isActive ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
                }}
                onClick={() => handleApplyPersona(item.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textAlign: 'left' }}>
                  <span style={{ fontSize: '1.4rem' }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>{item.title}</span>
                      {isActive && (
                        <span
                          style={{
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            color: item.badgeColor,
                            background: 'var(--bg-surface)',
                            border: `1px solid ${item.border}`,
                            padding: '0.1rem 0.45rem',
                            borderRadius: 'var(--radius-full)',
                          }}
                        >
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      {item.desc}
                    </div>
                  </div>
                </div>

                {isActive && (
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: item.badgeColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginLeft: '0.5rem',
                    }}
                  >
                    <Check size={13} color="#ffffff" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}

          {onOpenWelcome && (
            <button
              type="button"
              className="btn-secondary"
              style={{
                marginTop: '0.4rem',
                justifyContent: 'center',
                padding: '0.65rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                borderStyle: 'dashed',
              }}
              onClick={onOpenWelcome}
            >
              <span>✨ Switch Profile via Welcome Screen</span>
            </button>
          )}

          {presetStatus && (
            <div
              style={{
                fontSize: '0.78rem',
                color: '#10b981',
                fontWeight: 600,
                padding: '0.4rem',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              {presetStatus}
            </div>
          )}
        </div>
      </div>

      {/* App Version & Minimum Version Status */}
      <div
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Smartphone size={18} />
            <span>App Version & Updates</span>
          </h2>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--pill-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--card-border)',
            }}
          >
            v{APP_CURRENT_VERSION}
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Configured minimum supported version: <strong>v{versionConfig?.minVersion || '1.0.0'}</strong> (Latest: v{versionConfig?.latestVersion || '1.0.0'})
        </p>

        <button
          type="button"
          className="btn-secondary"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '0.7rem',
            fontSize: '0.84rem',
            fontWeight: 600,
            gap: '0.5rem',
          }}
          disabled={isCheckingVersion}
          onClick={handleCheckUpdates}
        >
          <RefreshCw size={15} className={isCheckingVersion ? 'spin' : ''} />
          <span>{isCheckingVersion ? 'Checking for Updates...' : 'Check for Updates'}</span>
        </button>

        {onOpenInstall && (
          <button
            type="button"
            className="btn-secondary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.7rem',
              fontSize: '0.84rem',
              fontWeight: 600,
              gap: '0.5rem',
              marginTop: '0.5rem',
            }}
            onClick={onOpenInstall}
          >
            <Download size={15} />
            <span>Install to Device</span>
          </button>
        )}

        {updateFeedback && (
          <div
            style={{
              fontSize: '0.76rem',
              color: '#3b82f6',
              fontWeight: 600,
              textAlign: 'center',
              marginTop: '0.5rem',
            }}
          >
            {updateFeedback}
          </div>
        )}
      </div>
    </div>
  );
};
