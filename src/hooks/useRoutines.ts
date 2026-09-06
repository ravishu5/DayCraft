import { useCallback, useState } from 'react';
import type { RoutineTemplate, TimeOfDay } from '../types';
import { StorageService } from '../services/storageService';

export function useRoutines() {
  const [templates, setTemplates] = useState<RoutineTemplate[]>(() => StorageService.getTemplates());

  const refresh = useCallback(() => {
    setTemplates(StorageService.getTemplates());
  }, []);

  const getTemplatesByCategory = useCallback(
    (category: TimeOfDay): RoutineTemplate[] => {
      return templates.filter((t) => t.category === category);
    },
    [templates]
  );

  const saveRoutine = useCallback(
    (routine: RoutineTemplate) => {
      StorageService.saveTemplate(routine);
      refresh();
    },
    [refresh]
  );

  const duplicateRoutine = useCallback(
    (id: string) => {
      const cloned = StorageService.duplicateTemplate(id);
      refresh();
      return cloned;
    },
    [refresh]
  );

  const deleteRoutine = useCallback(
    (id: string) => {
      StorageService.deleteTemplate(id);
      refresh();
    },
    [refresh]
  );

  return {
    templates,
    refresh,
    getTemplatesByCategory,
    saveRoutine,
    duplicateRoutine,
    deleteRoutine,
  };
}
