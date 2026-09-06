import React from 'react';
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
}

export const RoutineBlockCard: React.FC<RoutineBlockCardProps> = ({
  category,
  block,
  onChangeBlock,
  onToggleTask,
  onDeleteTask,
  onAddOneOffTask,
}) => {
  const meta = TIME_BLOCK_CONFIG[category];
  const allTasks = block.sections.flatMap((s) => s.tasks);
  const completedCount = allTasks.filter((t) => t.completed).length;

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

        <button
          type="button"
          id={`btn-change-${category}`}
          className="btn-change-block"
          onClick={() => onChangeBlock(category)}
          title={`Change ${meta.label} routine`}
        >
          <RefreshCw size={12} />
          <span>Change</span>
        </button>
      </div>

      {block.sections.length === 0 || allTasks.length === 0 ? (
        <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.85rem' }}>No tasks planned for this {meta.label.toLowerCase()}.</p>
          <button
            type="button"
            className="btn-secondary"
            style={{ marginTop: '0.6rem', padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
            onClick={() => onChangeBlock(category)}
          >
            Choose a Routine
          </button>
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
                  />
                ))}
              </div>
            </div>
          );
        })
      )}

      <div className="block-footer-action">
        <button
          type="button"
          id={`btn-add-task-${category}`}
          className="btn-add-inline-task"
          onClick={() => onAddOneOffTask(category)}
        >
          <Plus size={14} />
          <span>Add task to today's {meta.label.toLowerCase()}</span>
        </button>
        {allTasks.length > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {completedCount}/{allTasks.length} done
          </span>
        )}
      </div>
    </article>
  );
};
