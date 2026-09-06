import React, { useCallback } from 'react';
import { Check, Clock, Trash2 } from 'lucide-react';
import type { DailyTask } from '../../types';

interface TaskItemProps {
  task: DailyTask;
  onToggle: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

/**
 * Memoized: a day holds dozens of these, and toggling one task re-renders the whole
 * plan tree. Only the row whose task object actually changed needs to re-render.
 */
export const TaskItem: React.FC<TaskItemProps> = React.memo(({ task, onToggle, onDelete }) => {
  const handleToggle = useCallback(() => onToggle(task.id), [onToggle, task.id]);
  const handleDelete = useCallback(() => onDelete?.(task.id), [onDelete, task.id]);
  const stopPropagation = useCallback(
    (e: React.MouseEvent) => e.stopPropagation(),
    []
  );

  return (
    <div
      className={`task-item-row ${task.completed ? 'is-completed' : ''}`}
      onClick={handleToggle}
      role="checkbox"
      aria-checked={task.completed}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      <div className="task-checkbox-container" onClick={stopPropagation}>
        <button
          type="button"
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={handleToggle}
          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        >
          {task.completed && <Check className="check-icon" size={13} />}
        </button>
      </div>

      <div className="task-item-content">
        <div className="task-title-line">
          <span className="task-title">{task.title}</span>
          {task.time && (
            <span className="task-time-pill" title="Target time">
              <Clock size={10} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
              {task.time}
            </span>
          )}
        </div>
        {task.notes && <div className="task-notes">{task.notes}</div>}
      </div>

      {onDelete && (
        <div className="task-row-actions" onClick={stopPropagation}>
          <button
            type="button"
            className="btn-task-action"
            onClick={handleDelete}
            title="Delete task from today"
            aria-label={`Delete task ${task.title}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
});

TaskItem.displayName = 'TaskItem';
