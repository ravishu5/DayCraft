import React, { useEffect, useState } from 'react';
import { X, Smartphone, Download, Share, PlusSquare, Copy, Check, QrCode, Monitor } from 'lucide-react';
import QRCode from 'qrcode';
import type { BeforeInstallPromptEvent } from '../../types';
import { LATEST_APK_URL } from '../../constants/version';

interface InstallModalProps {
  onClose: () => void;
  deferredPrompt?: BeforeInstallPromptEvent | null;
}

export const InstallModal: React.FC<InstallModalProps> = ({ onClose, deferredPrompt }) => {
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isInstalling, setIsInstalling] = useState(false);

  // Detect platform
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const platformLabel = isIOS ? 'Apple iPhone / iPad' : isAndroid ? 'Android Device' : 'Desktop / Laptop';

  // Determine local network URL
  const localUrl = typeof window !== 'undefined'
    ? window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? `http://192.168.1.10:${window.location.port || '5173'}/`
      : window.location.href
    : 'http://192.168.1.10:5173/';

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(localUrl, {
      width: 220,
      margin: 1.5,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (!cancelled) setQrCodeDataUrl(url);
      })
      .catch((err) => console.error('QR generation error:', err));
    return () => {
      cancelled = true;
    };
  }, [localUrl]);

  const handleNativeInstall = async () => {
    if (!deferredPrompt) return;
    setIsInstalling(true);
    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(localUrl).catch(() => {
      // Clipboard blocked (insecure context or denied permission); the URL is on screen.
    });
    setCopied(true);
  };

  // Reset the "Copied" affordance without leaving a timer running past unmount.
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="bottom-sheet"
        style={{
          maxWidth: '540px',
          width: '100%',
          maxHeight: '92vh',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" />

        <div className="sheet-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Smartphone size={18} color="var(--accent-morning)" />
              <h2 className="sheet-title">Install DayCraft</h2>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Detected: <strong style={{ color: 'var(--text-primary)' }}>{platformLabel}</strong>
            </div>
          </div>
          <button type="button" className="btn-task-action" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="sheet-body" style={{ padding: '1.25rem' }}>
          {/* Native Install Button if supported */}
          {deferredPrompt && (
            <div
              style={{
                marginBottom: '1.25rem',
                padding: '1.15rem',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(56, 189, 248, 0.05) 100%)',
                border: '1px solid var(--accent-morning-border)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                1-Tap Install Available
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                Add DayCraft as an app on your home screen or desktop dock with offline support.
              </p>
              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleNativeInstall}
                disabled={isInstalling}
              >
                <Download size={15} />
                <span>{isInstalling ? 'Installing...' : 'Install App to Device'}</span>
              </button>
            </div>
          )}

          {/* Android Release APK Direct Download */}
          <div
            style={{
              marginBottom: '1.25rem',
              padding: '1.1rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '1.1rem' }}>🤖</span>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Direct Android APK (Release)
              </h3>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.45rem',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  borderRadius: '9999px',
                  marginLeft: 'auto',
                }}
              >
                Signed
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Standalone signed release APK, installable on any Android phone without app
              store restrictions.
            </p>
            <a
              href={LATEST_APK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                textDecoration: 'none',
                width: '100%',
                background: '#10b981',
                borderColor: '#10b981',
                color: '#ffffff',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              }}
            >
              <Download size={15} />
              <span>Download latest APK</span>
            </a>
          </div>

          {/* Section: Open on your Mobile Phone */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.15rem',
              marginBottom: '1.25rem',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              <QrCode size={16} color="var(--accent-afternoon)" />
              <span>Scan to Open on your Phone</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              Scan this QR code with your iPhone or Android camera to open DayCraft on your phone:
            </p>

            {qrCodeDataUrl ? (
              <div
                style={{
                  display: 'inline-block',
                  background: '#ffffff',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-sm)',
                  marginBottom: '0.85rem',
                }}
              >
                <img
                  src={qrCodeDataUrl}
                  alt="QR code to open DayCraft on your phone"
                  style={{ width: 170, height: 170, display: 'block' }}
                />
              </div>
            ) : (
              <div style={{ height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Generating QR code...
              </div>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem 0.75rem',
                gap: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {localUrl}
              </span>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', flexShrink: 0 }}
                onClick={handleCopyLink}
              >
                {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Platform Step-by-Step Instructions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* iOS Safari Guide */}
            <div
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                <span>🍎</span>
                <span>On iPhone or iPad (Safari)</span>
              </div>
              <ol style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                <li>
                  Open the link in <strong>Safari</strong> on your iPhone.
                </li>
                <li>
                  Tap the <Share size={13} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> <strong>Share</strong> icon at the bottom.
                </li>
                <li>
                  Scroll down and select <PlusSquare size={13} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> <strong>"Add to Home Screen"</strong>.
                </li>
                <li>
                  Tap <strong>Add</strong> in the top-right corner. It will appear with the official DayCraft app icon!
                </li>
              </ol>
            </div>

            {/* Android Chrome Guide */}
            <div
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                <span>🤖</span>
                <span>On Android (Chrome)</span>
              </div>
              <ol style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                <li>Open the link in <strong>Chrome</strong>.</li>
                <li>Tap the <strong>three dots (⋮)</strong> menu in the upper right.</li>
                <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
              </ol>
            </div>

            {/* Mac / PC Chrome Guide */}
            <div
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                <Monitor size={15} />
                <span>On Mac or PC (Chrome / Edge / Safari)</span>
              </div>
              <ol style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                <li>
                  Click the <strong>Install icon</strong> in your browser's address bar (or in Safari: File → Add to Dock).
                </li>
                <li>DayCraft will launch in its own dedicated, clean window!</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="sheet-footer">
          <button type="button" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
};
