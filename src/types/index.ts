export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'bedtime';

export interface RoutineTask {
  id: string;
  title: string;
  time?: string; // e.g. "08:15"
  notes?: string;
}

export interface RoutineSection {
  id: string;
  title: string; // e.g. "GET READY", "BEFORE LEAVING"
  tasks: RoutineTask[];
}

export type RoutinePersona = 'corporate' | 'student' | 'govt_aspirant' | 'general';

export interface RoutineTemplate {
  id: string;
  category: TimeOfDay;
  title: string;
  persona?: RoutinePersona;
  description?: string;
  sections: RoutineSection[];
  createdAt: string;
  updatedAt: string;
}

// Snapshot of daily plan to ensure template edits don't mutate past/existing days
export interface DailyTask {
  id: string;
  templateTaskId?: string;
  title: string;
  time?: string;
  notes?: string;
  completed: boolean;
  completedAt?: string;
  isOneOff?: boolean;
}

export interface DailyRoutineSection {
  id: string;
  title: string;
  tasks: DailyTask[];
}

export interface DailyRoutineBlock {
  category: TimeOfDay;
  routineTemplateId?: string; // id of template this was cloned from (if any)
  routineTitle: string;
  isCustom: boolean; // true if custom one-off or customized
  sections: DailyRoutineSection[];
}

export interface DailyPlan {
  date: string; // "YYYY-MM-DD"
  blocks: Record<TimeOfDay, DailyRoutineBlock>;
  lastModified: string;
}

// 0: Sunday, 1: Monday, ..., 6: Saturday
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type WeeklySchedule = Record<DayOfWeek, Record<TimeOfDay, string | null>>;

export type AppTab = 'today' | 'routines' | 'schedule' | 'history' | 'settings';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface TimeBlockMeta {
  category: TimeOfDay;
  label: string;
  emoji: string;
  defaultTimeRange: string;
  colorVar: string;
}

export const TIME_BLOCK_CONFIG: Record<TimeOfDay, TimeBlockMeta> = {
  morning: {
    category: 'morning',
    label: 'Morning',
    emoji: '🌅',
    defaultTimeRange: '6:00 AM – 12:00 PM',
    colorVar: 'var(--accent-morning)',
  },
  afternoon: {
    category: 'afternoon',
    label: 'Afternoon',
    emoji: '☀️',
    defaultTimeRange: '12:00 PM – 5:00 PM',
    colorVar: 'var(--accent-afternoon)',
  },
  evening: {
    category: 'evening',
    label: 'Evening',
    emoji: '🌆',
    defaultTimeRange: '5:00 PM – 9:30 PM',
    colorVar: 'var(--accent-evening)',
  },
  bedtime: {
    category: 'bedtime',
    label: 'Bedtime',
    emoji: '🌙',
    defaultTimeRange: '9:30 PM – Sleep',
    colorVar: 'var(--accent-bedtime)',
  },
};
