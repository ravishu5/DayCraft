import React, { useState } from 'react';
import { X, Clock, AlignLeft } from 'lucide-react';
import { TIME_BLOCK_CONFIG } from '../../types';
import type { DailyRoutineSection, TimeOfDay } from '../../types';

interface AddOneOffTaskModalProps {
  category: TimeOfDay;
  sections: DailyRoutineSection[];
  onAddTask: (taskData: { title: string; time?: string; notes?: string; sectionId?: string }) => void;
  onClose: () => void;
}

export const AddOneOffTaskModal: React.FC<AddOneOffTaskModalProps> = ({
  category,
  sections,
  onAddTask,
  onClose,
}) => {
  const meta = TIME_BLOCK_CONFIG[category];
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    sections.length > 0 ? sections[0].id : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      time: time.trim() || undefined,
      notes: notes.trim() || undefined,
      sectionId: selectedSectionId || undefined,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        <div className="sheet-header">
          <h2 className="sheet-title">Add Task to {meta.label}</h2>
          <button type="button" className="btn-task-action" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="sheet-body">
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              This one-off task is added directly to <strong>today's plan</strong> and does not change your routine template.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="task-title-input">Task Title *</label>
              <input
                id="task-title-input"
                className="form-input"
                placeholder="e.g. Call plumber, Buy gift card"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>

            {sections.length > 1 && (
              <div className="form-group">
                <label className="form-label" htmlFor="section-select">Section</label>
                <select
                  id="section-select"
                  className="form-select"
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                >
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="task-time-input">
                  <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                  Target Time
                </label>
                <input
                  id="task-time-input"
                  className="form-input"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-notes-input">
                  <AlignLeft size={12} style={{ display: 'inline', marginRight: 4 }} />
                  Notes (Optional)
                </label>
                <input
                  id="task-notes-input"
                  className="form-input"
                  placeholder="Additional details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="sheet-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!title.trim()}>
              Add to Today
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
