import React, { useState } from 'react';
import { X, Check, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { TIME_BLOCK_CONFIG } from '../../types';
import type { RoutineTemplate, TimeOfDay } from '../../types';

interface ChangeBlockModalProps {
  category: TimeOfDay;
  currentTemplateId?: string;
  currentTitle: string;
  templates: RoutineTemplate[];
  onSelectTemplate: (templateId: string) => void;
  onSetCustomRoutine: (title: string, sections: { title: string; tasks: { title: string; time?: string; notes?: string }[] }[]) => void;
  onClearBlock: () => void;
  onRevertToSchedule: () => void;
  onClose: () => void;
}

export const ChangeBlockModal: React.FC<ChangeBlockModalProps> = ({
  category,
  currentTemplateId,
  currentTitle,
  templates,
  onSelectTemplate,
  onSetCustomRoutine,
  onClearBlock,
  onRevertToSchedule,
  onClose,
}) => {
  const meta = TIME_BLOCK_CONFIG[category];
  const [isBuildingCustom, setIsBuildingCustom] = useState(false);

  // Custom routine builder state
  const [customTitle, setCustomTitle] = useState('');
  const [customTasks, setCustomTasks] = useState<{ title: string; time: string; notes: string }[]>([
    { title: '', time: '', notes: '' },
  ]);

  const handleAddCustomTaskRow = () => {
    setCustomTasks([...customTasks, { title: '', time: '', notes: '' }]);
  };

  const handleUpdateCustomTask = (index: number, field: 'title' | 'time' | 'notes', val: string) => {
    const updated = [...customTasks];
    updated[index][field] = val;
    setCustomTasks(updated);
  };

  const handleRemoveCustomTask = (index: number) => {
    setCustomTasks(customTasks.filter((_, i) => i !== index));
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const validTasks = customTasks.filter((t) => t.title.trim().length > 0);
    const title = customTitle.trim() || `Custom ${meta.label}`;
    onSetCustomRoutine(title, [
      {
        title: 'TASKS',
        tasks: validTasks,
      },
    ]);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        <div className="sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isBuildingCustom && (
              <button
                type="button"
                className="btn-task-action"
                onClick={() => setIsBuildingCustom(false)}
                title="Back to routines"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="sheet-title">
              {isBuildingCustom ? `New Custom ${meta.label}` : `Change ${meta.label} Routine`}
            </h2>
          </div>
          <button
            type="button"
            className="btn-task-action"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sheet-body">
          {!isBuildingCustom ? (
            <>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Select a routine for <strong>today's {meta.label.toLowerCase()}</strong> only. Other blocks and days won't change.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {templates.map((tpl) => {
                  const isSelected = currentTemplateId === tpl.id || currentTitle === tpl.title;
                  const totalTasks = tpl.sections.reduce((acc, s) => acc + s.tasks.length, 0);

                  return (
                    <div
                      key={tpl.id}
                      onClick={() => onSelectTemplate(tpl.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        background: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
                        border: isSelected ? `2px solid ${meta.colorVar}` : '1px solid var(--card-border)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                          {tpl.title}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          {tpl.description || `${totalTasks} tasks in ${tpl.sections.length} sections`}
                        </div>
                      </div>

                      {isSelected && (
                        <div
                          style={{
                            background: meta.colorVar,
                            color: '#ffffff',
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button
                  type="button"
                  id="btn-create-one-off"
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => setIsBuildingCustom(true)}
                >
                  <Plus size={15} />
                  <span>Create one-off custom {meta.label.toLowerCase()} for today</span>
                </button>

                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.2rem' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ flex: 1, fontSize: '0.78rem', padding: '0.5rem' }}
                    onClick={onRevertToSchedule}
                  >
                    Reset to Weekly Default
                  </button>
                  <button
                    type="button"
                    className="btn-danger-ghost"
                    style={{ flex: 1, fontSize: '0.78rem', padding: '0.5rem' }}
                    onClick={onClearBlock}
                  >
                    Mark as Off / Free
                  </button>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmitCustom}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                This custom routine applies only to today's {meta.label.toLowerCase()} and won't be saved as a reusable template.
              </p>

              <div className="form-group">
                <label className="form-label" htmlFor="custom-routine-title">Routine Title</label>
                <input
                  id="custom-routine-title"
                  className="form-input"
                  placeholder={`e.g. Travel ${meta.label}, Hospital Visit`}
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tasks</label>
                {customTasks.map((t, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '0.4rem',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <input
                      className="form-input"
                      placeholder="Task description..."
                      value={t.title}
                      onChange={(e) => handleUpdateCustomTask(idx, 'title', e.target.value)}
                      style={{ flex: 3 }}
                    />
                    <input
                      className="form-input"
                      type="time"
                      value={t.time}
                      onChange={(e) => handleUpdateCustomTask(idx, 'time', e.target.value)}
                      style={{ flex: 1.5 }}
                      title="Optional target time"
                    />
                    {customTasks.length > 1 && (
                      <button
                        type="button"
                        className="btn-task-action"
                        onClick={() => handleRemoveCustomTask(idx)}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="btn-secondary"
                  style={{ width: '100%', fontSize: '0.78rem', padding: '0.45rem' }}
                  onClick={handleAddCustomTaskRow}
                >
                  <Plus size={13} />
                  <span>Add another task</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setIsBuildingCustom(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  Apply to Today
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
