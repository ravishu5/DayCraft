import { useCallback, useState } from 'react';
import type { DayOfWeek, TimeOfDay, WeeklySchedule } from '../types';
import { StorageService } from '../services/storageService';

export function useWeeklySchedule() {
  const [schedule, setSchedule] = useState<WeeklySchedule>(() => StorageService.getWeeklySchedule());

  const saveBlockRule = useCallback(
    (day: DayOfWeek, category: TimeOfDay, templateId: string | null) => {
      const current = StorageService.getWeeklySchedule();
      const updated: WeeklySchedule = {
        ...current,
        [day]: {
          ...current[day],
          [category]: templateId,
        },
      };
      StorageService.saveWeeklySchedule(updated);
      setSchedule(updated);
    },
    []
  );

  const copyDayToWeekdays = useCallback((sourceDay: DayOfWeek) => {
    const current = StorageService.getWeeklySchedule();
    const sourceSchedule = current[sourceDay];
    const updated: WeeklySchedule = { ...current };

    // 1 to 5 = Mon to Fri
    [1, 2, 3, 4, 5].forEach((d) => {
      updated[d as DayOfWeek] = { ...sourceSchedule };
    });

    StorageService.saveWeeklySchedule(updated);
    setSchedule(updated);
  }, []);

  const resetSchedule = useCallback(() => {
    const def = StorageService.getWeeklySchedule();
    setSchedule(def);
  }, []);

  return {
    schedule,
    saveBlockRule,
    copyDayToWeekdays,
    resetSchedule,
  };
}
