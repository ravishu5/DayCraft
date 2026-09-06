import React, { useMemo, useState } from 'react';
import { ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { TIME_BLOCK_CONFIG, TIME_OF_DAY_ORDER } from '../../types';
import { StorageService, parseDateKey, formatDateKey } from '../../services/storageService';

interface HistoryViewProps {
  onSelectDate: (dateStr: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectDate }) => {
  const installDate = StorageService.getInstallDate();
  const todayKey = formatDateKey(new Date());

  // Strictly only include dates on or after installDate and up to today
  const allDates = useMemo(
    () =>
      Array.from(new Set([todayKey, ...StorageService.getStoredPlanDates()]))
        .filter((d) => d >= installDate && d <= todayKey)
        .sort((a, b) => b.localeCompare(a)),
    [installDate, todayKey]
  );
  const [activeDate, setActiveDate] = useState<string>(() => allDates[0] || todayKey);

  // `peekDailyPlan` never persists, so browsing history cannot create plan records as
  // a side effect of rendering.
  const selectedPlan = useMemo(() => StorageService.peekDailyPlan(activeDate), [activeDate]);
  const categories = TIME_OF_DAY_ORDER;

  const { totalTasks, completedTasks } = useMemo(() => {
    let total = 0;
    let completed = 0;
    for (const cat of TIME_OF_DAY_ORDER) {
      for (const section of selectedPlan.blocks[cat]?.sections ?? []) {
        for (const task of section.tasks) {
          total += 1;
          if (task.completed) completed += 1;
        }
      }
    }
    return { totalTasks: total, completedTasks: completed };
  }, [selectedPlan]);

  const dateFormatted = useMemo(
    () =>
      parseDateKey(activeDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    [activeDate]
  );

  return (
    <div className="history-view">
      <header className="view-header">
        <div className="view-header-top">
          <div>
            <div className="date-eyebrow">PAST & RECENT DAYS</div>
            <h1 className="view-title">History</h1>
          </div>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Inspect actual routine plans and checklists from previous days.
        </p>
      </header>

      {/* Date Picker Ribbon */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label className="form-label" style={{ marginBottom: '0.4rem' }}>Select Date</label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="date"
            className="form-input"
            min={installDate}
            max={todayKey}
            value={activeDate}
            onChange={(e) => {
              if (e.target.value && e.target.value >= installDate && e.target.value <= todayKey) {
                setActiveDate(e.target.value);
              }
            }}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.65rem 1rem' }}
            onClick={() => onSelectDate(activeDate)}
          >
            <span>Open in Today</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Recent Days Chips */}
      <div
        style={{
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          paddingBottom: '0.65rem',
          marginBottom: '1rem',
        }}
      >
        {allDates.slice(0, 10).map((d) => {
          const isSelected = activeDate === d;
          const dt = parseDateKey(d);
          const isToday = d === todayKey;
          const label = isToday ? 'Today' : dt.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });

          return (
            <button
              key={d}
              type="button"
              onClick={() => setActiveDate(d)}
              style={{
                background: isSelected ? 'var(--button-primary-bg)' : 'var(--bg-surface)',
                color: isSelected ? 'var(--button-primary-text)' : 'var(--text-secondary)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.75rem',
                fontSize: '0.76rem',
                fontWeight: isSelected ? 600 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'var(--transition-smooth)',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Selected Day Overview */}
      <div
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.2rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {dateFormatted}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              {totalTasks === 0 ? 'No tasks logged' : `${completedTasks} of ${totalTasks} tasks completed`}
            </div>
          </div>

          <div
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--card-border)',
              fontSize: '0.76rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            {totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% Complete` : 'Clear'}
          </div>
        </div>

        {/* Breakdown by block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {categories.map((cat) => {
            const meta = TIME_BLOCK_CONFIG[cat];
            const block = selectedPlan.blocks[cat];
            const blockTasks = block ? block.sections.flatMap((s) => s.tasks) : [];

            return (
              <div
                key={cat}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 0.9rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>{meta.emoji}</span>
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {block ? block.routineTitle : 'None'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {blockTasks.filter((t) => t.completed).length}/{blockTasks.length} done
                  </span>
                </div>

                {blockTasks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.4rem' }}>
                    {blockTasks.map((t) => (
                      <div
                        key={t.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.8rem',
                          color: t.completed ? 'var(--text-done)' : 'var(--text-secondary)',
                          textDecoration: t.completed ? 'line-through' : 'none',
                        }}
                      >
                        <CheckCircle2
                          size={13}
                          color={t.completed ? '#10b981' : 'var(--text-muted)'}
                        />
                        <span style={{ flex: 1 }}>{t.title}</span>
                        {t.time && (
                          <span style={{ fontSize: '0.68rem', opacity: 0.7 }}>
                            <Clock size={10} style={{ display: 'inline', marginRight: 2 }} />
                            {t.time}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No tasks planned
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
