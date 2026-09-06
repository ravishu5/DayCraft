import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import type { RoutinePersona } from '../../types';

interface WelcomeViewProps {
  onSelectPersona: (persona: RoutinePersona) => void;
  onSkip: () => void;
}

interface PersonaOption {
  id: RoutinePersona;
  title: string;
  emoji: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  tagline: string;
  description: string;
  highlights: string[];
}

const PERSONA_OPTIONS: PersonaOption[] = [
  {
    id: 'govt_aspirant',
    title: 'Govt Exam Aspirant',
    emoji: '🏛️',
    badge: '100% Full-Time Self-Study',
    badgeColor: '#d97706',
    badgeBg: 'rgba(217, 119, 6, 0.12)',
    badgeBorder: 'rgba(217, 119, 6, 0.3)',
    tagline: 'UPSC · SSC · Banking · State PSC',
    description:
      'Full-time solitary self-study with zero schooling or job distractions. Engineered for maximum syllabus coverage and mock tests.',
    highlights: [
      'Dawn editorial analysis & note-making',
      'GS static subject slot 1 (2.5h deep study)',
      'Optional subject & CSAT aptitude drills',
      'Timed mock test & mistake notebook audit',
    ],
  },
  {
    id: 'corporate',
    title: 'Corporate Professional',
    emoji: '💼',
    badge: 'Office & Remote',
    badgeColor: '#0284c7',
    badgeBg: 'rgba(2, 132, 199, 0.12)',
    badgeBorder: 'rgba(2, 132, 199, 0.3)',
    tagline: 'Office Commute · WFH · Meetings',
    description:
      'High-performance workdays balancing deep work sprints, cross-functional syncs, post-work fitness, and digital boundary wind-downs.',
    highlights: [
      'Morning commute & calendar standup prep',
      '90-minute morning deep work sprints',
      'Midday screen breaks & afternoon wrap-up',
      'Gym reset & zero-work-email bedtime',
    ],
  },
  {
    id: 'student',
    title: 'College & University Student',
    emoji: '🎓',
    badge: 'Campus & Classes',
    badgeColor: '#9333ea',
    badgeBg: 'rgba(147, 51, 234, 0.12)',
    badgeBorder: 'rgba(147, 51, 234, 0.3)',
    tagline: 'Lectures · Labs · Deadlines',
    description:
      'Balancing lecture schedules, laboratory sessions, assignment sprints, study groups, and exam prep without burning out.',
    highlights: [
      'Front-row lecture prep & backpack check',
      'Campus library study blocks & problem sets',
      'Group project collaboration & essay deadlines',
      'Multi-alarm reset & healthy sleep',
    ],
  },
  {
    id: 'general',
    title: 'General Lifestyle',
    emoji: '✨',
    badge: 'Custom Explorer',
    badgeColor: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    badgeBorder: 'rgba(16, 185, 129, 0.3)',
    tagline: 'Personal routines & flexible flow',
    description:
      'Clean slate designed for personal habits, creative freelance days, or balanced living across all 4 daily blocks.',
    highlights: [
      'Morning fresh rhythm & hydration',
      'Productive midday focus hours',
      'Relaxed evening unwinding',
      'Restful bedtime preparation',
    ],
  },
];

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onSelectPersona, onSkip }) => {
  const [selectedPersona, setSelectedPersona] = useState<RoutinePersona>('govt_aspirant');

  const activeOption = PERSONA_OPTIONS.find((o) => o.id === selectedPersona)!;

  return (
    <div
      className="welcome-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 0,
        margin: 0,
      }}
    >
      <div
        className="welcome-sheet"
        style={{
          width: '100%',
          maxWidth: '100%',
          height: 'calc(100% - 3.75rem - env(safe-area-inset-top, 24px))',
          maxHeight: 'calc(100% - 3.75rem - env(safe-area-inset-top, 24px))',
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--card-border)',
          borderRadius: '24px 24px 0 0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* Sheet Handle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '0.65rem',
            paddingBottom: '0.25rem',
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--card-border)' }} />
        </div>

        {/* Welcome Header */}
        <div
          style={{
            padding: '0.75rem 1.25rem 1rem 1.25rem',
            textAlign: 'center',
            borderBottom: '1px solid var(--card-border)',
            background: 'var(--bg-surface)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              fontSize: '0.74rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '0.75rem',
            }}
          >
            <Sparkles size={13} color="#f59e0b" />
            <span>WELCOME TO DAYCRAFT</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            What is your daily focus?
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.35rem', maxWidth: '420px', margin: '0.35rem auto 0 auto' }}>
            We'll customize your <strong>Morning</strong>, <strong>Afternoon</strong>, <strong>Evening</strong>, and <strong>Bedtime</strong> blocks to match how you live.
          </p>
        </div>

        {/* Persona Selection List */}
        <div
          className="sheet-body"
          style={{
            padding: '1.15rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            overflowY: 'auto',
          }}
        >
          {PERSONA_OPTIONS.map((opt) => {
            const isSelected = selectedPersona === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedPersona(opt.id)}
                style={{
                  padding: '1.05rem',
                  borderRadius: 'var(--radius-lg)',
                  border: isSelected ? `2px solid ${opt.badgeColor}` : '1px solid var(--card-border)',
                  background: isSelected ? opt.badgeBg : 'var(--card-bg)',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                  boxShadow: isSelected ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{opt.emoji}</span>
                    <div>
                      <h2 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {opt.title}
                      </h2>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {opt.tagline}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        color: opt.badgeColor,
                        background: opt.badgeBg,
                        border: `1px solid ${opt.badgeBorder}`,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {opt.badge}
                    </span>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: isSelected ? `2px solid ${opt.badgeColor}` : '2px solid var(--checkbox-border)',
                        background: isSelected ? opt.badgeColor : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isSelected && <Check size={13} color="#ffffff" strokeWidth={3} />}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.45rem', lineHeight: 1.45 }}>
                  {opt.description}
                </p>

                {isSelected && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      paddingTop: '0.65rem',
                      borderTop: `1px dashed ${opt.badgeBorder}`,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.35rem',
                    }}
                  >
                    {opt.highlights.map((hl, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: '0.71rem',
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <span style={{ color: opt.badgeColor, fontWeight: 700 }}>•</span>
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '1rem 1.25rem calc(1.15rem + env(safe-area-inset-bottom, 20px)) 1.25rem',
            borderTop: '1px solid var(--card-border)',
            background: 'var(--card-bg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.6rem 0.9rem' }}
            onClick={onSkip}
          >
            Skip & Explore
          </button>

          <button
            type="button"
            id="btn-confirm-welcome"
            className="btn-primary"
            style={{
              flex: 1,
              fontSize: '0.88rem',
              padding: '0.7rem 1.2rem',
              background: activeOption.badgeColor,
              color: '#ffffff',
            }}
            onClick={() => onSelectPersona(selectedPersona)}
          >
            <span>Start with {activeOption.title}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
