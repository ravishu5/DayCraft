import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { TIME_BLOCK_CONFIG, TIME_OF_DAY_ORDER } from '../../types';
import type { DayOfWeek } from '../../types';
import { useWeeklySchedule } from '../../hooks/useWeeklySchedule';
import { useRoutines } from '../../hooks/useRoutines';

const DAYS_OF_WEEK: { day: DayOfWeek; name: string; short: string }[] = [
  { day: 1, name: 'Monday', short: 'Mon' },
  { day: 2, name: 'Tuesday', short: 'Tue' },
  { day: 3, name: 'Wednesday', short: 'Wed' },
  { day: 4, name: 'Thursday', short: 'Thu' },
  { day: 5, name: 'Friday', short: 'Fri' },
  { day: 6, name: 'Saturday', short: 'Sat' },
  { day: 0, name: 'Sunday', short: 'Sun' },
];

export const ScheduleView: React.FC = () => {
  const { schedule, saveBlockRule, copyDayToWeekdays } = useWeeklySchedule();
  const { getTemplatesByCategory } = useRoutines();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(1); // Monday default
  const [copiedNotification, setCopiedNotification] = useState(false);

  const categories = TIME_OF_DAY_ORDER;
  const daySchedule = schedule[selectedDay] || {
    morning: null,
    afternoon: null,
    evening: null,
    bedtime: null,
  };

  const handleCopyWeekdays = () => {
    copyDayToWeekdays(selectedDay);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2200);
  };

  const selectedDayMeta = DAYS_OF_WEEK.find((d) => d.day === selectedDay)!;

  return (
    <div className="schedule-view">
      <header className="view-header">
        <div className="view-header-top">
          <div>
            <div className="date-eyebrow">RECURRING DEFAULTS</div>
            <h1 className="view-title">Weekly Schedule</h1>
          </div>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Assign default routines for each day of the week. New days automatically load these templates into your plan.
        </p>
      </header>

      {/* Weekday Selector Ribbon */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.25rem',
          background: 'var(--bg-surface)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--card-border)',
          marginBottom: '1.25rem',
        }}
      >
        {DAYS_OF_WEEK.map((d) => {
          const isSelected = selectedDay === d.day;
          return (
            <button
              key={d.day}
              type="button"
              id={`schedule-day-${d.short.toLowerCase()}`}
              onClick={() => setSelectedDay(d.day)}
              style={{
                background: isSelected ? 'var(--card-bg)' : 'transparent',
                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.6rem 0.2rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                transition: 'var(--transition-smooth)',
              }}
            >
              {d.short}
            </button>
          );
        })}
      </div>

      {/* Day Overview & Copy action */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {selectedDayMeta.name} Defaults
        </h2>

        <button
          type="button"
          className="btn-secondary"
          style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }}
          onClick={handleCopyWeekdays}
          title="Apply this day's routines to Monday through Friday"
        >
          {copiedNotification ? (
            <>
              <Check size={13} color="#10b981" />
              <span>Copied to Mon–Fri!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy to Mon–Fri</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Block Selectors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {categories.map((cat) => {
          const meta = TIME_BLOCK_CONFIG[cat];
          const availableTemplates = getTemplatesByCategory(cat);
          const currentTemplateId = daySchedule[cat];

          return (
            <div
              key={cat}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{meta.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{meta.label}</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {meta.defaultTimeRange}
                </span>
              </div>

              <select
                className="form-select"
                value={currentTemplateId || ''}
                onChange={(e) => saveBlockRule(selectedDay, cat, e.target.value || null)}
                aria-label={`Default routine for ${meta.label} on ${selectedDayMeta.name}`}
              >
                <option value="">(None / Take Off)</option>
                {availableTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '0.85rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--card-border)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
        }}
      >
        💡 <strong>Note on overrides:</strong> Changing your schedule here updates your default blueprint for future unvisited days. Any specific day you’ve already personalized or completed stays frozen and protected.
      </div>
    </div>
  );
};
