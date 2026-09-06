import React, { useCallback, useMemo } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { TIME_BLOCK_CONFIG } from '../../types';
import type { DailyRoutineBlock, TimeOfDay } from '../../types';
import { TaskItem } from './TaskItem';

interface RoutineBlockCardProps {
  category: TimeOfDay;
  block: DailyRoutineBlock;
  onChangeBlock: (category: TimeOfDay) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddOneOffTask: (category: TimeOfDay) => void;
  /** Past days are frozen: hide the mutating affordances entirely. */
  readOnly?: boolean;
}

export const RoutineBlockCard: React.FC<RoutineBlockCardProps> = React.memo(({
  category,
  block,
  onChangeBlock,
  onToggleTask,
  onDeleteTask,
  onAddOneOffTask,
  readOnly = false,
}) => {
  const meta = TIME_BLOCK_CONFIG[category];

  // Two passes over every task in the block, recomputed only when the block changes.
  const { taskCount, completedCount } = useMemo(() => {
    let taskCount = 0;
    let completedCount = 0;
    for (const section of block.sections) {
      for (const task of section.tasks) {
        taskCount += 1;
        if (task.completed) completedCount += 1;
      }
    }
    return { taskCount, completedCount };
  }, [block]);

  const handleChangeBlock = useCallback(() => onChangeBlock(category), [onChangeBlock, category]);
  const handleAddTask = useCallback(() => onAddOneOffTask(category), [onAddOneOffTask, category]);

  return (
    <article className={`routine-block-card block-${category}`} aria-labelledby={`block-heading-${category}`}>
      <div className="block-card-header block-header-bg">
        <div className="block-header-left">
          <div className="block-header-meta">
            <span className="category-badge">
              <span>{meta.emoji}</span>
              <span>{meta.label}</span>
            </span>
            <span className="time-range-pill">{meta.defaultTimeRange}</span>
          </div>
          <h2 id={`block-heading-${category}`} className="routine-name">
            {block.routineTitle}
            {block.isCustom && <span className="custom-tag">Custom</span>}
          </h2>
        </div>

        {!readOnly && (
          <button
            type="button"
            id={`btn-change-${category}`}
            className="btn-change-block"
            onClick={handleChangeBlock}
            title={`Change ${meta.label} routine`}
          >
            <RefreshCw size={12} />
            <span>Change</span>
          </button>
        )}
      </div>

      {taskCount === 0 ? (
        <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.85rem' }}>No tasks planned for this {meta.label.toLowerCase()}.</p>
          {!readOnly && (
            <button
              type="button"
              className="btn-secondary"
              style={{ marginTop: '0.6rem', padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
              onClick={handleChangeBlock}
            >
              Choose a Routine
            </button>
          )}
        </div>
      ) : (
        block.sections.map((section) => {
          if (section.tasks.length === 0) return null;
          return (
            <div key={section.id} className="routine-section-group">
              <div className="section-label">{section.title}</div>
              <div className="section-tasks-list">
                {section.tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onDelete={onDeleteTask}
                    readOnly={readOnly}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}

      <div className="block-footer-action">
        {!readOnly && (
          <button
            type="button"
            id={`btn-add-task-${category}`}
            className="btn-add-inline-task"
            onClick={handleAddTask}
          >
            <Plus size={14} />
            <span>Add task to today's {meta.label.toLowerCase()}</span>
          </button>
        )}
        {taskCount > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {completedCount}/{taskCount} done
          </span>
        )}
      </div>
    </article>
  );
});

RoutineBlockCard.displayName = 'RoutineBlockCard';
