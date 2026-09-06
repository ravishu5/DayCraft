import React, { useState } from 'react';
import { Plus, Edit3, Copy, Trash2 } from 'lucide-react';
import { TIME_BLOCK_CONFIG } from '../../types';
import type { RoutineTemplate, TimeOfDay } from '../../types';
import { useRoutines } from '../../hooks/useRoutines';
import { StorageService } from '../../services/storageService';
import { RoutineEditorModal } from './RoutineEditorModal';

export const RoutinesView: React.FC = () => {
  const { getTemplatesByCategory, saveRoutine, duplicateRoutine, deleteRoutine } = useRoutines();
  const [activeCategory, setActiveCategory] = useState<TimeOfDay>('morning');

  // Modal editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<RoutineTemplate | null>(null);

  const categories: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'bedtime'];
  const currentTemplates = getTemplatesByCategory(activeCategory);
  const filteredTemplates = currentTemplates;
  const activeMeta = TIME_BLOCK_CONFIG[activeCategory];

  const activePersona = StorageService.getSelectedPersona();
  const personaLabels: Record<string, { label: string; emoji: string; color: string }> = {
    govt_aspirant: { label: 'Govt Exam Aspirant', emoji: '🏛️', color: '#d97706' },
    corporate: { label: 'Corporate Professional', emoji: '💼', color: '#0284c7' },
    student: { label: 'College & University Student', emoji: '🎓', color: '#9333ea' },
    general: { label: 'General Lifestyle', emoji: '✨', color: '#10b981' },
  };
  const currentPersonaMeta = activePersona ? personaLabels[activePersona] : null;

  const handleOpenCreate = () => {
    setEditingRoutine(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (routine: RoutineTemplate) => {
    setEditingRoutine(routine);
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete routine template "${title}"? This will not affect days where it was already applied.`)) {
      deleteRoutine(id);
    }
  };

  return (
    <div className="routines-view">
      <header className="view-header">
        <div className="view-header-top">
          <div>
            <div className="date-eyebrow">TEMPLATES LIBRARY</div>
            <h1 className="view-title">Routines</h1>
          </div>
          <button
            type="button"
            id="btn-create-routine"
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem' }}
            onClick={handleOpenCreate}
          >
            <Plus size={15} />
            <span>New Routine</span>
          </button>
        </div>
      </header>

      {/* 4 Category Segmented Control */}
      <div className="category-segmented-control" role="tablist">
        {categories.map((cat) => {
          const meta = TIME_BLOCK_CONFIG[cat];
          const isActive = activeCategory === cat;
          const count = getTemplatesByCategory(cat).length;
          return (
            <button
              key={cat}
              role="tab"
              id={`tab-${cat}`}
              aria-selected={isActive}
              className={`segment-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              type="button"
            >
              <span>{meta.emoji}</span>
              <span>{meta.label}</span>
              <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Active Blueprint Scope Indicator */}
      {currentPersonaMeta && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.45rem 0.85rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1rem',
            fontSize: '0.78rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>{currentPersonaMeta.emoji}</span>
            <span style={{ color: 'var(--text-muted)' }}>Blueprint:</span>
            <span style={{ fontWeight: 700, color: currentPersonaMeta.color }}>
              {currentPersonaMeta.label}
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Active routines only
          </span>
        </div>
      )}

      {/* Templates List */}
      <div className="templates-list">
        {filteredTemplates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">{activeMeta.emoji}</div>
            <h2 className="empty-state-title">No matching {activeMeta.label} Routines</h2>
            <p className="empty-state-desc">
              Create reusable templates for your {activeMeta.label.toLowerCase()} to quickly plan your days.
            </p>
            <button type="button" className="btn-primary" onClick={handleOpenCreate}>
              <Plus size={15} />
              <span>Create {activeMeta.label} Routine</span>
            </button>
          </div>
        ) : (
          filteredTemplates.map((template) => {
            const totalTasks = template.sections.reduce((acc, s) => acc + s.tasks.length, 0);
            return (
              <div key={template.id} className="routine-template-card">
                <div className="template-card-info" style={{ flex: 1, paddingRight: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <h3>{template.title}</h3>
                    {template.persona === 'corporate' && (
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 600,
                          background: 'rgba(2, 132, 199, 0.12)',
                          color: '#0284c7',
                          border: '1px solid rgba(2, 132, 199, 0.3)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        💼 Corporate
                      </span>
                    )}
                    {template.persona === 'student' && (
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 600,
                          background: 'rgba(147, 51, 234, 0.12)',
                          color: '#9333ea',
                          border: '1px solid rgba(147, 51, 234, 0.3)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        🎓 Student
                      </span>
                    )}
                    {template.persona === 'govt_aspirant' && (
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 600,
                          background: 'rgba(217, 119, 6, 0.12)',
                          color: '#d97706',
                          border: '1px solid rgba(217, 119, 6, 0.3)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        🏛️ Govt Exam
                      </span>
                    )}
                    {template.persona === 'general' && (
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 600,
                          background: 'rgba(16, 185, 129, 0.12)',
                          color: '#10b981',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        ✨ General
                      </span>
                    )}
                  </div>
                  {template.description && <p>{template.description}</p>}
                  <div className="template-card-stats">
                    <span>{totalTasks} tasks</span>
                    <span>•</span>
                    <span>{template.sections.length} {template.sections.length === 1 ? 'section' : 'sections'}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {template.sections.map((s) => s.title).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="template-card-actions">
                  <button
                    type="button"
                    className="btn-task-action"
                    onClick={() => duplicateRoutine(template.id)}
                    title="Duplicate template"
                    aria-label={`Duplicate ${template.title}`}
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-task-action"
                    onClick={() => handleOpenEdit(template)}
                    title="Edit template"
                    aria-label={`Edit ${template.title}`}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-task-action"
                    onClick={() => handleDelete(template.id, template.title)}
                    title="Delete template"
                    aria-label={`Delete ${template.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Routine Editor Modal */}
      {isEditorOpen && (
        <RoutineEditorModal
          initialRoutine={editingRoutine}
          defaultCategory={activeCategory}
          onSave={saveRoutine}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
};
