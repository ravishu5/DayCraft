import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DailyPlan, TimeOfDay } from '../types';
import { TIME_OF_DAY_ORDER } from '../types';
import {
  StorageService,
  removePlanTask,
  togglePlanTask,
} from '../services/storageService';

export function useDailyPlan(dateStr: string) {
  const [plan, setPlan] = useState<DailyPlan>(() => StorageService.getDailyPlan(dateStr));
  const loadedDateRef = useRef(dateStr);

  // Reload only when the date actually changes. Running unconditionally re-read and
  // re-parsed the plan on every mount, right after the initializer had just loaded it,
  // costing a second render on each tab switch back to Today.
  useEffect(() => {
    if (loadedDateRef.current === dateStr) return;
    loadedDateRef.current = dateStr;
    setPlan(StorageService.getDailyPlan(dateStr));
  }, [dateStr]);

  const reload = useCallback(() => {
    setPlan(StorageService.getDailyPlan(dateStr));
  }, [dateStr]);

  // Toggle and delete run on every tap, so they transform the plan already in state
  // instead of re-reading and re-parsing the day from localStorage. The updater is a
  // pure function of `prev` and the write is idempotent, so StrictMode's double
  // invocation is harmless.
  const toggleTask = useCallback((taskId: string) => {
    setPlan((prev) => {
      const next = togglePlanTask(prev, taskId);
      if (next !== prev) StorageService.saveDailyPlan(next);
      return next;
    });
  }, []);

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

  const deleteDailyTask = useCallback((taskId: string) => {
    setPlan((prev) => {
      const next = removePlanTask(prev, taskId);
      if (next !== prev) StorageService.saveDailyPlan(next);
      return next;
    });
  }, []);

  const stats = useMemo(() => {
    let total = 0;
    let completed = 0;

    for (const cat of TIME_OF_DAY_ORDER) {
      for (const section of plan.blocks[cat]?.sections ?? []) {
        for (const task of section.tasks) {
          total += 1;
          if (task.completed) completed += 1;
        }
      }
    }

    return { total, completed, ratio: total > 0 ? completed / total : 0 };
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
