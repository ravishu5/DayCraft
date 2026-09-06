import React, { useCallback, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TimeOfDay } from '../../types';
import { TIME_OF_DAY_ORDER } from '../../types';
import { useDailyPlan } from '../../hooks/useDailyPlan';
import { useRoutines } from '../../hooks/useRoutines';
import { RoutineBlockCard } from './RoutineBlockCard';
import { ChangeBlockModal } from './ChangeBlockModal';
import { AddOneOffTaskModal } from './AddOneOffTaskModal';
import { formatDateKey, parseDateKey, StorageService } from '../../services/storageService';

interface TodayViewProps {
  currentDateStr: string;
  onDateChange: (newDateStr: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({ currentDateStr, onDateChange }) => {
  const {
    plan,
    stats,
    toggleTask,
    replaceBlockWithTemplate,
    replaceBlockWithCustom,
    clearBlock,
    revertBlockToSchedule,
    addOneOffTask,
    deleteDailyTask,
  } = useDailyPlan(currentDateStr);

  const { getTemplatesByCategory } = useRoutines();

  // Active modals
  const [changingCategory, setChangingCategory] = useState<TimeOfDay | null>(null);
  const [addingTaskCategory, setAddingTaskCategory] = useState<TimeOfDay | null>(null);

  const currentDateObj = useMemo(() => parseDateKey(currentDateStr), [currentDateStr]);
  const todayKey = formatDateKey(new Date());
  const isToday = currentDateStr === todayKey;

  // `toLocaleDateString` builds an Intl formatter each call; keep it off every render.
  const formattedDate = useMemo(
    () =>
      currentDateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
    [currentDateObj]
  );

  const installDate = StorageService.getInstallDate();
  const canGoPrev = currentDateStr > installDate;

  const handlePrevDay = useCallback(() => {
    if (!canGoPrev) return;
    const prev = new Date(currentDateObj);
    prev.setDate(prev.getDate() - 1);
    const prevStr = formatDateKey(prev);
    if (prevStr >= installDate) {
      onDateChange(prevStr);
    }
  }, [canGoPrev, currentDateObj, installDate, onDateChange]);

  const handleNextDay = useCallback(() => {
    const next = new Date(currentDateObj);
    next.setDate(next.getDate() + 1);
    onDateChange(formatDateKey(next));
  }, [currentDateObj, onDateChange]);

  const handleJumpToToday = useCallback(() => {
    onDateChange(todayKey);
  }, [onDateChange, todayKey]);

  return (
    <div className="today-view">
      {/* View Header */}
      <header className="view-header">
        <div className="view-header-top">
          <div>
            <div className="date-eyebrow">
              {isToday ? "TODAY'S FLOW" : 'PAST SCHEDULE'}
            </div>
            <h1 className="view-title">{formattedDate}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              className="date-ribbon-btn"
              onClick={handlePrevDay}
              disabled={!canGoPrev}
              style={{
                opacity: canGoPrev ? 1 : 0.3,
                cursor: canGoPrev ? 'pointer' : 'not-allowed',
              }}
              title={canGoPrev ? 'Previous Day' : 'Cannot view dates prior to app installation'}
              aria-label="Previous day"
            >
              <ChevronLeft size={16} />
            </button>
            {!isToday && (
              <button
                type="button"
                className="date-ribbon-btn current"
                onClick={handleJumpToToday}
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.6rem' }}
              >
                Today
              </button>
            )}
            <button
              type="button"
              className="date-ribbon-btn"
              onClick={handleNextDay}
              title="Next Day"
              aria-label="Next day"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Notice when viewing past days */}
        {!isToday && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.85rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius-lg)',
              marginTop: '0.6rem',
              fontSize: '0.78rem',
              gap: '0.5rem',
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>
              Viewing past saved schedule for <strong>{formattedDate}</strong>
            </span>
            <button
              type="button"
              className="btn-primary"
              style={{
                padding: '0.3rem 0.65rem',
                fontSize: '0.72rem',
                flexShrink: 0,
              }}
              onClick={handleJumpToToday}
            >
              Back to Today
            </button>
          </div>
        )}

        {/* Calm Progress Bar */}
        <div className="progress-container">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${Math.round(stats.ratio * 100)}%` }}
            />
          </div>
          <span className="progress-text">
            {stats.total === 0
              ? 'No tasks'
              : `${stats.completed} of ${stats.total} completed`}
          </span>
        </div>
      </header>

      {/* 4 Composed Routine Blocks */}
      <div className="blocks-container">
        {TIME_OF_DAY_ORDER.map((cat) => {
          const block = plan.blocks[cat];
          return (
            <RoutineBlockCard
              key={cat}
              category={cat}
              block={block}
              onChangeBlock={setChangingCategory}
              onToggleTask={toggleTask}
              onDeleteTask={deleteDailyTask}
              onAddOneOffTask={setAddingTaskCategory}
            />
          );
        })}
      </div>

      {/* Change Routine Block Modal */}
      {changingCategory && (
        <ChangeBlockModal
          category={changingCategory}
          currentTemplateId={plan.blocks[changingCategory]?.routineTemplateId}
          currentTitle={plan.blocks[changingCategory]?.routineTitle}
          templates={getTemplatesByCategory(changingCategory)}
          onSelectTemplate={(templateId) => {
            replaceBlockWithTemplate(changingCategory, templateId);
            setChangingCategory(null);
          }}
          onSetCustomRoutine={(title, sections) => {
            replaceBlockWithCustom(changingCategory, title, sections);
            setChangingCategory(null);
          }}
          onClearBlock={() => {
            clearBlock(changingCategory);
            setChangingCategory(null);
          }}
          onRevertToSchedule={() => {
            revertBlockToSchedule(changingCategory);
            setChangingCategory(null);
          }}
          onClose={() => setChangingCategory(null)}
        />
      )}

      {/* Add One-Off Task Modal */}
      {addingTaskCategory && (
        <AddOneOffTaskModal
          category={addingTaskCategory}
          sections={plan.blocks[addingTaskCategory]?.sections || []}
          onAddTask={(taskData) => {
            addOneOffTask(addingTaskCategory, taskData);
          }}
          onClose={() => setAddingTaskCategory(null)}
        />
      )}
    </div>
  );
};
