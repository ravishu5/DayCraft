import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DailyPlan, TimeOfDay } from '../types';
import { StorageService } from '../services/storageService';

export function useDailyPlan(dateStr: string) {
  const [plan, setPlan] = useState<DailyPlan>(() => StorageService.getDailyPlan(dateStr));

  useEffect(() => {
    setPlan(StorageService.getDailyPlan(dateStr));
  }, [dateStr]);

  const reload = useCallback(() => {
    setPlan(StorageService.getDailyPlan(dateStr));
  }, [dateStr]);

  const toggleTask = useCallback(
    (taskId: string) => {
      const updated = StorageService.toggleTask(dateStr, taskId);
      setPlan({ ...updated });
    },
    [dateStr]
  );

  const replaceBlockWithTemplate = useCallback(
    (category: TimeOfDay, templateId: string) => {
      const updated = StorageService.replaceBlockWithTemplate(dateStr, category, templateId);
      setPlan({ ...updated });
    },
    [dateStr]
  );

  const replaceBlockWithCustom = useCallback(
    (
      category: TimeOfDay,
      title: string,
      sections: { title: string; tasks: { title: string; time?: string; notes?: string }[] }[]
    ) => {
      const updated = StorageService.replaceBlockWithCustom(dateStr, category, title, sections);
      setPlan({ ...updated });
    },
    [dateStr]
  );

  const clearBlock = useCallback(
    (category: TimeOfDay) => {
      const updated = StorageService.clearBlock(dateStr, category);
      setPlan({ ...updated });
    },
    [dateStr]
  );

  const revertBlockToSchedule = useCallback(
    (category: TimeOfDay) => {
      const updated = StorageService.revertBlockToSchedule(dateStr, category);
      setPlan({ ...updated });
    },
    [dateStr]
  );

  const addOneOffTask = useCallback(
    (
      category: TimeOfDay,
      taskData: { title: string; time?: string; notes?: string; sectionId?: string }
    ) => {
      const updated = StorageService.addOneOffTask(dateStr, category, taskData);
      setPlan({ ...updated });
    },
    [dateStr]
  );

  const deleteDailyTask = useCallback(
    (taskId: string) => {
      const updated = StorageService.deleteDailyTask(dateStr, taskId);
      setPlan({ ...updated });
    },
    [dateStr]
  );

  const stats = useMemo(() => {
    let total = 0;
    let completed = 0;

    const categories: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'bedtime'];
    categories.forEach((cat) => {
      const block = plan.blocks[cat];
      if (!block) return;
      block.sections.forEach((sec) => {
        sec.tasks.forEach((task) => {
          total += 1;
          if (task.completed) completed += 1;
        });
      });
    });

    return {
      total,
      completed,
      ratio: total > 0 ? completed / total : 0,
    };
  }, [plan]);

  return {
    plan,
    stats,
    reload,
    toggleTask,
    replaceBlockWithTemplate,
    replaceBlockWithCustom,
    clearBlock,
    revertBlockToSchedule,
    addOneOffTask,
    deleteDailyTask,
  };
}
