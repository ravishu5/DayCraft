import React, { useState } from 'react';
import { X, Plus, Trash2, ArrowUp, ArrowDown, Clock, AlignLeft } from 'lucide-react';
import { TIME_BLOCK_CONFIG, TIME_OF_DAY_ORDER } from '../../types';
import type { RoutineTemplate, RoutineSection, RoutineTask, TimeOfDay, RoutinePersona } from '../../types';
import { generateId, StorageService } from '../../services/storageService';

interface RoutineEditorModalProps {
  initialRoutine?: RoutineTemplate | null;
  defaultCategory?: TimeOfDay;
  onSave: (routine: RoutineTemplate) => void;
  onClose: () => void;
}

export const RoutineEditorModal: React.FC<RoutineEditorModalProps> = ({
  initialRoutine,
  defaultCategory = 'morning',
  onSave,
  onClose,
}) => {
  const [category, setCategory] = useState<TimeOfDay>(
    initialRoutine ? initialRoutine.category : defaultCategory
  );
  const [persona, setPersona] = useState<RoutinePersona>(
    initialRoutine?.persona || StorageService.getSelectedPersona() || 'general'
  );
  const [title, setTitle] = useState(initialRoutine ? initialRoutine.title : '');
  const [description, setDescription] = useState(initialRoutine ? initialRoutine.description || '' : '');

  const [sections, setSections] = useState<RoutineSection[]>(() => {
    if (initialRoutine && initialRoutine.sections.length > 0) {
      return JSON.parse(JSON.stringify(initialRoutine.sections));
    }
    return [
      {
        id: generateId(),
        title: 'MAIN',
        tasks: [{ id: generateId(), title: '', time: '', notes: '' }],
      },
    ];
  });

  // Section handlers
  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        id: generateId(),
        title: 'NEW SECTION',
        tasks: [{ id: generateId(), title: '' }],
      },
    ]);
  };

  const handleUpdateSectionTitle = (sectionId: string, newTitle: string) => {
    setSections(
      sections.map((sec) => (sec.id === sectionId ? { ...sec, title: newTitle } : sec))
    );
  };

  const handleDeleteSection = (sectionId: string) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((sec) => sec.id !== sectionId));
  };

  // Task handlers
  const handleAddTask = (sectionId: string) => {
    setSections(
      sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          tasks: [...sec.tasks, { id: generateId(), title: '', time: '', notes: '' }],
        };
      })
    );
  };

  const handleUpdateTask = (
    sectionId: string,
    taskId: string,
    field: keyof RoutineTask,
    value: string
  ) => {
    setSections(
      sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          tasks: sec.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              [field]: value || undefined,
            };
          }),
        };
      })
    );
  };

  const handleDeleteTask = (sectionId: string, taskId: string) => {
    setSections(
      sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          tasks: sec.tasks.filter((t) => t.id !== taskId),
        };
      })
    );
  };

  const handleMoveTask = (sectionId: string, index: number, direction: 'up' | 'down') => {
    setSections(
      sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const newTasks = [...sec.tasks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newTasks.length) return sec;
        const temp = newTasks[index];
        newTasks[index] = newTasks[targetIndex];
        newTasks[targetIndex] = temp;
        return { ...sec, tasks: newTasks };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Filter out completely empty tasks
    const cleanedSections = sections
      .map((sec) => ({
        ...sec,
        title: sec.title.trim() || 'TASKS',
        tasks: sec.tasks.filter((t) => t.title.trim().length > 0),
      }))
      .filter((sec) => sec.tasks.length > 0);

    const updatedRoutine: RoutineTemplate = {
      id: initialRoutine ? initialRoutine.id : generateId(),
      category,
      persona,
      title: title.trim(),
      description: description.trim() || undefined,
      sections:
        cleanedSections.length > 0
          ? cleanedSections
          : [
              {
                id: generateId(),
                title: 'TASKS',
                tasks: [{ id: generateId(), title: 'Example Task' }],
              },
            ],
      createdAt: initialRoutine ? initialRoutine.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedRoutine);
    onClose();
  };

  const categories = TIME_OF_DAY_ORDER;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bottom-sheet" style={{ maxHeight: '92vh' }} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        <div className="sheet-header">
          <h2 className="sheet-title">
            {initialRoutine ? 'Edit Routine Template' : 'New Routine Template'}
          </h2>
          <button type="button" className="btn-task-action" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="sheet-body">
            {/* Category Selector */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                {categories.map((cat) => {
                  const meta = TIME_BLOCK_CONFIG[cat];
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      style={{
                        padding: '0.5rem 0.2rem',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? `2px solid ${meta.colorVar}` : '1px solid var(--card-border)',
                        background: isSelected ? meta.colorVar + '18' : 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.15rem',
                      }}
                    >
                      <span style={{ fontSize: '1rem' }}>{meta.emoji}</span>
                      <span>{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Profile / Persona */}
            <div className="form-group">
              <label className="form-label">Target Lifestyle</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
                {[
                  { id: 'corporate' as const, label: '💼 Corporate' },
                  { id: 'student' as const, label: '🎓 College / School' },
                  { id: 'govt_aspirant' as const, label: '🏛️ Govt Exam (Self-Study)' },
                  { id: 'general' as const, label: '✨ General Lifestyle' },
                ].map((p) => {
                  const isSelected = persona === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPersona(p.id)}
                      style={{
                        padding: '0.45rem 0.4rem',
                        fontSize: '0.74rem',
                        fontWeight: isSelected ? 700 : 500,
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--text-primary)' : '1px solid var(--card-border)',
                        background: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)',
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title & Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="routine-title-input">Template Title *</label>
              <input
                id="routine-title-input"
                className="form-input"
                placeholder="e.g. Office Morning, Lazy Weekend"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="routine-desc-input">Description (Optional)</label>
              <input
                id="routine-desc-input"
                className="form-input"
                placeholder="Brief summary of this routine..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Sections & Tasks */}
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Sections & Tasks</label>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ fontSize: '0.74rem', padding: '0.3rem 0.6rem' }}
                  onClick={handleAddSection}
                >
                  <Plus size={12} />
                  <span>Add Section</span>
                </button>
              </div>

              {sections.map((sec) => (
                <div
                  key={sec.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <input
                      className="form-input"
                      value={sec.title}
                      onChange={(e) => handleUpdateSectionTitle(sec.id, e.target.value)}
                      placeholder="SECTION TITLE (e.g. GET READY)"
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        padding: '0.35rem 0.6rem',
                      }}
                    />
                    {sections.length > 1 && (
                      <button
                        type="button"
                        className="btn-task-action"
                        onClick={() => handleDeleteSection(sec.id)}
                        title="Delete section"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Tasks in Section */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {sec.tasks.map((task, taskIdx) => (
                      <div
                        key={task.id}
                        style={{
                          background: 'var(--card-bg)',
                          border: '1px solid var(--card-border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.5rem 0.6rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.35rem',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <input
                            className="form-input"
                            placeholder="Task title..."
                            value={task.title}
                            onChange={(e) => handleUpdateTask(sec.id, task.id, 'title', e.target.value)}
                            style={{ flex: 1, padding: '0.35rem 0.55rem', fontSize: '0.86rem' }}
                          />

                          {/* Reorder Buttons */}
                          <div style={{ display: 'flex', gap: '0.1rem' }}>
                            <button
                              type="button"
                              className="btn-task-action"
                              disabled={taskIdx === 0}
                              onClick={() => handleMoveTask(sec.id, taskIdx, 'up')}
                              title="Move up"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              className="btn-task-action"
                              disabled={taskIdx === sec.tasks.length - 1}
                              onClick={() => handleMoveTask(sec.id, taskIdx, 'down')}
                              title="Move down"
                            >
                              <ArrowDown size={14} />
                            </button>
                          </div>

                          <button
                            type="button"
                            className="btn-task-action"
                            onClick={() => handleDeleteTask(sec.id, task.id)}
                            title="Delete task"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Optional Time & Notes row */}
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', width: '110px' }}>
                            <Clock size={12} color="var(--text-muted)" />
                            <input
                              type="time"
                              className="form-input"
                              value={task.time || ''}
                              onChange={(e) => handleUpdateTask(sec.id, task.id, 'time', e.target.value)}
                              style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
                              title="Target time"
                            />
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }}>
                            <AlignLeft size={12} color="var(--text-muted)" />
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Notes (optional)..."
                              value={task.notes || ''}
                              onChange={(e) => handleUpdateTask(sec.id, task.id, 'notes', e.target.value)}
                              style={{ padding: '0.25rem 0.45rem', fontSize: '0.75rem' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ fontSize: '0.74rem', padding: '0.35rem 0.5rem', width: '100%', justifyContent: 'center' }}
                      onClick={() => handleAddTask(sec.id)}
                    >
                      <Plus size={12} />
                      <span>Add Task to {sec.title}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sheet-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!title.trim()}>
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
