import React from 'react';
import { Download, RefreshCw, AlertTriangle, Sparkles, X } from 'lucide-react';
import type { AppVersionConfig } from '../../types/version';
import { RELEASES_PAGE_URL } from '../../constants/version';

interface UpdateModalProps {
  currentVersion: string;
  isUpdateRequired: boolean;
  isUpdateAvailable: boolean;
  config: AppVersionConfig | null;
  isChecking: boolean;
  onCheckAgain: () => void;
  onDismiss?: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  currentVersion,
  isUpdateRequired,
  isUpdateAvailable,
  config,
  isChecking,
  onCheckAgain,
  onDismiss
}) => {
  if (!isUpdateAvailable && !isUpdateRequired) return null;
  if (!config) return null;

  const handleDownload = () => {
    const targetUrl = config.downloadUrl || RELEASES_PAGE_URL;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="update-modal-overlay">
      <div className={`update-modal-card ${isUpdateRequired ? 'required' : 'optional'}`}>
        {!isUpdateRequired && onDismiss && (
          <button 
            className="update-close-btn" 
            onClick={onDismiss}
            aria-label="Dismiss update"
          >
            <X size={18} />
          </button>
        )}

        <div className="update-modal-header">
          <div className={`update-icon-wrap ${isUpdateRequired ? 'required' : 'optional'}`}>
            {isUpdateRequired ? <AlertTriangle size={32} /> : <Sparkles size={32} />}
          </div>
          <h2 className="update-title">
            {isUpdateRequired ? (config.title || 'Update Required') : 'Update Available'}
          </h2>
          <p className="update-subtitle">
            {config.message || (isUpdateRequired 
              ? 'Your version of DayCraft is no longer supported. Please update to continue.' 
              : 'A newer version of DayCraft is ready for you!')}
          </p>
        </div>

        <div className="update-version-badges">
          <div className="version-badge current">
            <span className="badge-label">Installed</span>
            <span className="badge-value">v{currentVersion}</span>
          </div>
          <div className="version-arrow">➔</div>
          <div className={`version-badge ${isUpdateRequired ? 'required' : 'latest'}`}>
            <span className="badge-label">{isUpdateRequired ? 'Required Min' : 'Latest'}</span>
            <span className="badge-value">
              v{isUpdateRequired ? config.minVersion : config.latestVersion}
            </span>
          </div>
        </div>

        {config.releaseNotes && config.releaseNotes.length > 0 && (
          <div className="update-notes-box">
            <div className="notes-header">What's New:</div>
            <ul className="notes-list">
              {config.releaseNotes.map((note, index) => (
                <li key={index} className="note-item">
                  <span className="note-bullet">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="update-actions">
          <button 
            className="update-primary-btn"
            onClick={handleDownload}
          >
            <Download size={18} />
            <span>{isUpdateRequired ? 'Download & Install Update' : 'Update Now'}</span>
          </button>

          <button 
            className="update-secondary-btn"
            onClick={onCheckAgain}
            disabled={isChecking}
          >
            <RefreshCw size={16} className={isChecking ? 'spin' : ''} />
            <span>{isChecking ? 'Checking...' : 'Check Again'}</span>
          </button>

          {!isUpdateRequired && onDismiss && (
            <button 
              className="update-dismiss-btn"
              onClick={onDismiss}
            >
              Maybe Later
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
