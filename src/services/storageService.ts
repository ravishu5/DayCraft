import type {
  DailyPlan,
  DailyRoutineBlock,
  DailyRoutineSection,
  DailyTask,
  DayOfWeek,
  RoutineTemplate,
  RoutinePersona,
  TimeOfDay,
  WeeklySchedule,
} from '../types';
import { TIME_OF_DAY_ORDER } from '../types';
import { DEFAULT_ROUTINES } from '../data/defaultTemplates';
import {
  DEFAULT_WEEKLY_SCHEDULE,
  DEFAULT_CORPORATE_SCHEDULE,
  DEFAULT_STUDENT_SCHEDULE,
  DEFAULT_GOVT_ASPIRANT_SCHEDULE,
  DEFAULT_GENERAL_SCHEDULE,
} from '../data/defaultSchedule';

const STORAGE_KEYS = {
  TEMPLATES: 'daycraft_templates_v2',
  SCHEDULE: 'daycraft_schedule_v2',
  DAILY_PREFIX: 'daycraft_plan_',
  PLAN_INDEX: 'daycraft_plan_dates_v1',
  THEME: 'daycraft_theme_v1',
  INSTALL_DATE: 'daycraft_install_date_v1',
  SELECTED_PERSONA: 'daycraft_selected_persona',
  ONBOARDED: 'daycraft_onboarded',
  PERSONA_TEMPLATES_PREFIX: 'daycraft_templates_persona_',
  PERSONA_SCHEDULE_PREFIX: 'daycraft_schedule_persona_',
};

const KEY_PREFIX = 'daycraft_';

const EMPTY_DAY_SCHEDULE: Record<TimeOfDay, string | null> = {
  morning: null,
  afternoon: null,
  evening: null,
  bedtime: null,
};

const VALID_PERSONAS: readonly RoutinePersona[] = ['corporate', 'student', 'govt_aspirant', 'general'];

// Flags written by earlier releases; any of them means onboarding already happened.
const LEGACY_ONBOARDED_KEYS = [
  STORAGE_KEYS.ONBOARDED,
  'daycraft_onboarded_v3',
  'daycraft_onboarded_v2',
  'daycraft_onboarded_v1',
];

/**
 * Parsed-value cache for the keys that are read far more often than they are written
 * (templates, weekly schedule, install date, active persona).
 *
 * Building a single day's plan used to re-parse the full template set once per time
 * block; every render that touched the store paid the same cost again. Entries are
 * dropped on write, so the cache can never serve a stale value.
 *
 * Values handed out are shared references: treat them as immutable and clone before
 * mutating (see `saveTemplate`).
 */
const readCache = new Map<string, unknown>();

function readJSON<T>(key: string): T | null {
  if (readCache.has(key)) {
    return readCache.get(key) as T;
  }
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    const parsed = JSON.parse(raw) as T;
    readCache.set(key, parsed);
    return parsed;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    readCache.set(key, value);
  } catch {
    // Quota exceeded or storage unavailable: drop the entry rather than cache a
    // value that never reached disk.
    readCache.delete(key);
  }
}

function readString(key: string): string | null {
  if (readCache.has(key)) {
    return readCache.get(key) as string | null;
  }
  try {
    const raw = localStorage.getItem(key);
    readCache.set(key, raw);
    return raw;
  } catch {
    return null;
  }
}

function writeString(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
    readCache.set(key, value);
  } catch {
    readCache.delete(key);
  }
}

function invalidate(key: string): void {
  readCache.delete(key);
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Convert date to YYYY-MM-DD
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Parse YYYY-MM-DD to local Date object
export function parseDateKey(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Returns a plan with `taskId` toggled, reusing the object identity of every block,
 * section and task that did not change. Returns the original plan when the task is
 * not found, so callers can cheaply detect a no-op.
 *
 * Structural sharing is what lets the memoized block/task components skip re-rendering
 * the rest of the day when one checkbox flips.
 */
export function togglePlanTask(plan: DailyPlan, taskId: string): DailyPlan {
  let hit = false;

  const blocks = {} as Record<TimeOfDay, DailyRoutineBlock>;
  for (const cat of TIME_OF_DAY_ORDER) {
    const block = plan.blocks[cat];
    if (!block || hit) {
      blocks[cat] = block;
      continue;
    }

    let blockChanged = false;
    const sections = block.sections.map((section) => {
      if (hit || !section.tasks.some((t) => t.id === taskId)) return section;

      blockChanged = true;
      hit = true;
      return {
        ...section,
        tasks: section.tasks.map((task) => {
          if (task.id !== taskId) return task;
          const completed = !task.completed;
          return {
            ...task,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined,
          };
        }),
      };
    });

    blocks[cat] = blockChanged ? { ...block, sections } : block;
  }

  if (!hit) return plan;
  return { ...plan, blocks, lastModified: new Date().toISOString() };
}

/** Removes `taskId` from the plan, preserving identity of everything untouched. */
export function removePlanTask(plan: DailyPlan, taskId: string): DailyPlan {
  let hit = false;

  const blocks = {} as Record<TimeOfDay, DailyRoutineBlock>;
  for (const cat of TIME_OF_DAY_ORDER) {
    const block = plan.blocks[cat];
    if (!block || hit) {
      blocks[cat] = block;
      continue;
    }

    let blockChanged = false;
    const sections = block.sections.map((section) => {
      if (hit || !section.tasks.some((t) => t.id === taskId)) return section;

      blockChanged = true;
      hit = true;
      return { ...section, tasks: section.tasks.filter((t) => t.id !== taskId) };
    });

    blocks[cat] = blockChanged ? { ...block, sections } : block;
  }

  if (!hit) return plan;
  return { ...plan, blocks, lastModified: new Date().toISOString() };
}

export class StorageService {
  // ================= PERSONA / ONBOARDING =================

  static getSelectedPersona(): RoutinePersona | null {
    const p = readString(STORAGE_KEYS.SELECTED_PERSONA);
    if (p && VALID_PERSONAS.includes(p as RoutinePersona)) {
      return p as RoutinePersona;
    }
    return null;
  }

  /** The persona whose templates/schedule are currently in scope. */
  private static activePersona(fallback: RoutinePersona = 'govt_aspirant'): RoutinePersona {
    return this.getSelectedPersona() || fallback;
  }

  static setSelectedPersona(persona: RoutinePersona): void {
    writeString(STORAGE_KEYS.SELECTED_PERSONA, persona);
    writeString(STORAGE_KEYS.ONBOARDED, 'true');
    writeString('daycraft_onboarded_v3', 'true');
  }

  static hasSelectedPersona(): boolean {
    try {
      if (this.getSelectedPersona() !== null) {
        return true;
      }
      // Check legacy or onboarding completion flags
      if (
        LEGACY_ONBOARDED_KEYS.some((key) => readString(key) === 'true')
      ) {
        return true;
      }
      // If user has stored plans from previous usage, they already have an active profile
      const planDates = this.getStoredPlanDates();
      if (planDates.length > 0) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  static getDefaultScheduleForPersona(persona: RoutinePersona): WeeklySchedule {
    if (persona === 'student') return DEFAULT_STUDENT_SCHEDULE;
    if (persona === 'govt_aspirant') return DEFAULT_GOVT_ASPIRANT_SCHEDULE;
    if (persona === 'general') return DEFAULT_GENERAL_SCHEDULE;
    return DEFAULT_CORPORATE_SCHEDULE;
  }

  static getDefaultTemplatesForPersona(persona: RoutinePersona): RoutineTemplate[] {
    return DEFAULT_ROUTINES.filter((t) => t.persona === persona);
  }

  // ================= TEMPLATES (SCOPED PER BLUEPRINT) =================

  /**
   * Retrieves routine templates for the current active blueprint.
   * Only returns routines belonging to this blueprint.
   * If user added custom routines while in this blueprint, they are persisted and returned.
   */
  static getTemplates(): RoutineTemplate[] {
    const personaKey = STORAGE_KEYS.PERSONA_TEMPLATES_PREFIX + this.activePersona();
    const loaded = readJSON<RoutineTemplate[]>(personaKey);
    if (Array.isArray(loaded)) {
      return loaded;
    }

    // First time for this persona: initialize with this blueprint's defaults
    const defaults = this.getDefaultTemplatesForPersona(this.activePersona());
    writeJSON(personaKey, defaults);
    return defaults;
  }

  static getTemplateById(id: string): RoutineTemplate | undefined {
    return this.getTemplates().find((t) => t.id === id);
  }

  static saveTemplates(templates: RoutineTemplate[]): void {
    writeJSON(STORAGE_KEYS.PERSONA_TEMPLATES_PREFIX + this.activePersona(), templates);
  }

  /**
   * Adds or updates a routine in the CURRENT blueprint only.
   * It persists permanently under this blueprint even when switching back and forth.
   * Also immediately syncs any active daily plans (today and future) using this template.
   */
  static saveTemplate(template: RoutineTemplate): void {
    const updated: RoutineTemplate = {
      ...template,
      persona: this.activePersona(),
      updatedAt: new Date().toISOString(),
    };

    // Copy rather than mutate: `getTemplates()` may hand back the cached array.
    const templates = this.getTemplates().slice();
    const index = templates.findIndex((t) => t.id === template.id);
    if (index >= 0) {
      templates[index] = updated;
    } else {
      templates.push(updated);
    }
    this.saveTemplates(templates);

    // Immediately sync changes to today's and upcoming daily plans
    this.syncUpdatedTemplateToActivePlans(updated);
  }

  /**
   * Automatically updates any active daily routine block (today and future dates)
   * that uses this routine template, so editing a routine immediately reflects
   * on the homepage without needing to manually re-select the routine.
   *
   * Preserves:
   * - Completion status of tasks (matched by templateTaskId or task title)
   * - One-off custom tasks added directly to the daily schedule
   */
  static syncUpdatedTemplateToActivePlans(template: RoutineTemplate): void {
    const todayStr = formatDateKey(new Date());

    // Gather today and all recorded plan dates that are >= todayStr
    const candidateDates = new Set<string>();
    candidateDates.add(todayStr);

    this.getStoredPlanDates().forEach((d) => {
      if (d >= todayStr) {
        candidateDates.add(d);
      }
    });

    candidateDates.forEach((dateKey) => {
      const storageKey = STORAGE_KEYS.DAILY_PREFIX + dateKey;
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return;
        const plan: DailyPlan = JSON.parse(raw);
        let modified = false;

        TIME_OF_DAY_ORDER.forEach((cat) => {
          const block = plan.blocks[cat];
          if (!block) return;

          // Check if this block corresponds to the edited template
          // Either by routineTemplateId or by title matching if routineTemplateId was missing
          if (block.routineTemplateId === template.id || (!block.isCustom && block.routineTitle === template.title)) {
            modified = true;

            // 1. Gather completion status of existing tasks and any one-off tasks
            const completedTaskIds = new Set<string>();
            const completedTaskTitles = new Set<string>();
            const oneOffTasks: DailyTask[] = [];

            block.sections.forEach((sec) => {
              sec.tasks.forEach((task) => {
                if (task.isOneOff) {
                  oneOffTasks.push(task);
                } else if (task.completed) {
                  if (task.templateTaskId) {
                    completedTaskIds.add(task.templateTaskId);
                  }
                  completedTaskTitles.add(task.title.trim().toLowerCase());
                }
              });
            });

            // 2. Instantiate a fresh block from the updated template
            const newBlock = this.instantiateBlockFromTemplate(template);

            // 3. Restore completed state for matching tasks
            newBlock.sections.forEach((sec) => {
              sec.tasks.forEach((task) => {
                if (
                  (task.templateTaskId && completedTaskIds.has(task.templateTaskId)) ||
                  completedTaskTitles.has(task.title.trim().toLowerCase())
                ) {
                  task.completed = true;
                }
              });
            });

            // 4. Preserve any one-off tasks in the last section
            if (oneOffTasks.length > 0 && newBlock.sections.length > 0) {
              const lastSection = newBlock.sections[newBlock.sections.length - 1];
              lastSection.tasks.push(...oneOffTasks);
            }

            plan.blocks[cat] = newBlock;
          }
        });

        if (modified) {
          plan.lastModified = new Date().toISOString();
          localStorage.setItem(storageKey, JSON.stringify(plan));
        }
      } catch {
        // ignore
      }
    });
  }

  static deleteTemplate(id: string): void {
    const templates = this.getTemplates().filter((t) => t.id !== id);
    this.saveTemplates(templates);

    // If today's block was using this template, mark it as isCustom: true so it doesn't break
    const todayStr = formatDateKey(new Date());
    const storageKey = STORAGE_KEYS.DAILY_PREFIX + todayStr;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const plan: DailyPlan = JSON.parse(raw);
        let modified = false;
        TIME_OF_DAY_ORDER.forEach((cat) => {
          if (plan.blocks[cat]?.routineTemplateId === id) {
            plan.blocks[cat].isCustom = true;
            plan.blocks[cat].routineTemplateId = undefined;
            modified = true;
          }
        });
        if (modified) {
          localStorage.setItem(storageKey, JSON.stringify(plan));
        }
      }
    } catch {
      // ignore
    }
  }

  static duplicateTemplate(id: string): RoutineTemplate | null {
    const original = this.getTemplateById(id);
    if (!original) return null;

    const cloned: RoutineTemplate = {
      ...original,
      id: generateId(),
      persona: this.activePersona(),
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: original.sections.map((sec) => ({
        id: generateId(),
        title: sec.title,
        tasks: sec.tasks.map((task) => ({
          ...task,
          id: generateId(),
        })),
      })),
    };

    this.saveTemplate(cloned);
    return cloned;
  }

  // ================= WEEKLY SCHEDULE (SCOPED PER BLUEPRINT) =================

  /**
   * Retrieves the weekly schedule for the active blueprint.
   * If the user previously altered this blueprint's schedule, those changes are preserved.
   */
  static getWeeklySchedule(): WeeklySchedule {
    const persona = this.activePersona('corporate');
    const personaKey = STORAGE_KEYS.PERSONA_SCHEDULE_PREFIX + persona;
    const loaded = readJSON<WeeklySchedule>(personaKey);
    if (loaded) return loaded;

    const defaultSched = this.getDefaultScheduleForPersona(persona);
    writeJSON(personaKey, defaultSched);
    return defaultSched;
  }

  /**
   * Saves the weekly schedule for the active blueprint.
   */
  static saveWeeklySchedule(schedule: WeeklySchedule): void {
    writeJSON(STORAGE_KEYS.PERSONA_SCHEDULE_PREFIX + this.activePersona('corporate'), schedule);
  }

  /**
   * Switches the active blueprint to `persona`:
   * - Restores this blueprint's routines (including any user-added routines for this blueprint)
   * - Removes routines from all other blueprints
   * - Restores this blueprint's weekly schedule
   * - Immediately updates today's routine blocks (preserving past history)
   */
  static applyPersonaSchedule(
    persona: RoutinePersona,
    targetDateStr?: string
  ): WeeklySchedule {
    // 1. Mark selected persona
    this.setSelectedPersona(persona);

    // 2. Load the weekly schedule for this blueprint (persisted user schedule if previously edited, or defaults)
    const sched = this.getWeeklySchedule();

    // 3. Load the routine templates for this blueprint (persisted user routines if previously edited/added, or defaults)
    const templates = this.getTemplates();

    // 4. Update daily plan for today (protect past history)
    const todayStr = formatDateKey(new Date());
    const dateKey = targetDateStr || todayStr;

    if (dateKey >= todayStr) {
      const dateObj = parseDateKey(dateKey);
      const dayOfWeek = dateObj.getDay() as DayOfWeek;
      const daySchedule = sched[dayOfWeek] || EMPTY_DAY_SCHEDULE;

      const plan = this.getDailyPlan(dateKey);
      TIME_OF_DAY_ORDER.forEach((cat) => {
        const templateId = daySchedule[cat];
        if (templateId) {
          const template = templates.find((t) => t.id === templateId) || this.getTemplateById(templateId);
          if (template) {
            plan.blocks[cat] = this.instantiateBlockFromTemplate(template);
            return;
          }
        }
        plan.blocks[cat] = this.createEmptyBlock(cat);
      });

      this.saveDailyPlan(plan);
    }

    return sched;
  }

  // ================= DAILY PLANS (SNAPSHOTS) =================

  /**
   * Read on nearly every store access and every date-navigation render, so it is
   * cached in memory after the first read.
   */
  static getInstallDate(): string {
    const cached = readString(STORAGE_KEYS.INSTALL_DATE);
    if (cached) return cached;

    const date = formatDateKey(new Date());
    writeString(STORAGE_KEYS.INSTALL_DATE, date);
    return date;
  }

  static purgePreInstallPlans(): void {
    try {
      const installDate = this.getInstallDate();
      const list = readJSON<string[]>(STORAGE_KEYS.PLAN_INDEX);
      if (list) {
        const filtered = list.filter((d) => d >= installDate);
        if (filtered.length !== list.length) {
          writeJSON(STORAGE_KEYS.PLAN_INDEX, filtered);
        }
      }
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEYS.DAILY_PREFIX)) {
          const planDate = key.replace(STORAGE_KEYS.DAILY_PREFIX, '');
          if (planDate < installDate) {
            keysToRemove.push(key);
          }
        }
      }
      keysToRemove.forEach((k) => {
        localStorage.removeItem(k);
        invalidate(k);
      });
    } catch {
      // ignore
    }
  }

  /** Recorded plan dates on or after install, newest first. */
  static getStoredPlanDates(): string[] {
    const installDate = this.getInstallDate();
    const list = readJSON<string[]>(STORAGE_KEYS.PLAN_INDEX);
    if (!Array.isArray(list)) return [];
    return list.filter((d) => d >= installDate).sort((a, b) => b.localeCompare(a));
  }

  private static recordPlanDate(dateStr: string): void {
    if (dateStr < this.getInstallDate()) return;

    const dates = this.getStoredPlanDates();
    // Already indexed: skip the re-serialize entirely (the common case, since every
    // task toggle re-saves the plan).
    if (dates.includes(dateStr)) return;

    dates.push(dateStr);
    writeJSON(STORAGE_KEYS.PLAN_INDEX, dates.sort((a, b) => b.localeCompare(a)));
  }

  /**
   * Clones a template into an independent snapshot block for a daily plan.
   * Modifying templates later will NOT affect this snapshot.
   */
  static instantiateBlockFromTemplate(template: RoutineTemplate): DailyRoutineBlock {
    return {
      category: template.category,
      routineTemplateId: template.id,
      routineTitle: template.title,
      isCustom: false,
      sections: template.sections.map((sec) => ({
        id: generateId(),
        title: sec.title,
        tasks: sec.tasks.map((task) => ({
          id: generateId(),
          templateTaskId: task.id,
          title: task.title,
          time: task.time,
          notes: task.notes,
          completed: false,
          isOneOff: false,
        })),
      })),
    };
  }

  static createEmptyBlock(category: TimeOfDay, customTitle = 'No Routine'): DailyRoutineBlock {
    return {
      category,
      routineTitle: customTitle,
      isCustom: true,
      sections: [
        {
          id: generateId(),
          title: 'TASKS',
          tasks: [],
        },
      ],
    };
  }

  /**
   * Retrieves or creates a daily plan snapshot for a given date.
   * If a snapshot already exists in storage, it is returned untouched.
   * If not, the weekly schedule rules for that day of the week are applied to create a new snapshot.
   */
  private static readStoredPlan(dateStr: string): DailyPlan | null {
    try {
      const existing = localStorage.getItem(STORAGE_KEYS.DAILY_PREFIX + dateStr);
      return existing ? (JSON.parse(existing) as DailyPlan) : null;
    } catch {
      return null;
    }
  }

  /** Builds (but does not persist) the plan implied by the weekly schedule for a date. */
  private static buildPlanFromSchedule(dateStr: string): DailyPlan {
    const dayOfWeek = parseDateKey(dateStr).getDay() as DayOfWeek;
    const daySchedule = this.getWeeklySchedule()[dayOfWeek] || EMPTY_DAY_SCHEDULE;

    // One template lookup pass, so building a plan parses the template set once
    // instead of once per time block.
    const templates = this.getTemplates();
    const blocks = {} as Record<TimeOfDay, DailyRoutineBlock>;

    TIME_OF_DAY_ORDER.forEach((cat) => {
      const templateId = daySchedule[cat];
      const template = templateId ? templates.find((t) => t.id === templateId) : undefined;
      blocks[cat] = template
        ? this.instantiateBlockFromTemplate(template)
        : this.createEmptyBlock(cat);
    });

    return { date: dateStr, blocks, lastModified: new Date().toISOString() };
  }

  /**
   * Read-only view of a day's plan. Unlike `getDailyPlan` this never writes, so it is
   * safe to call from a React render pass.
   */
  static peekDailyPlan(dateStr: string): DailyPlan {
    return this.readStoredPlan(dateStr) ?? this.buildPlanFromSchedule(dateStr);
  }

  static getDailyPlan(dateStr: string): DailyPlan {
    const existing = this.readStoredPlan(dateStr);
    if (existing) return existing;

    const newPlan = this.buildPlanFromSchedule(dateStr);
    if (dateStr >= this.getInstallDate()) {
      this.saveDailyPlan(newPlan);
    }
    return newPlan;
  }

  static saveDailyPlan(plan: DailyPlan): void {
    const installDate = this.getInstallDate();
    if (plan.date < installDate) return;

    const updatedPlan: DailyPlan = {
      ...plan,
      lastModified: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_PREFIX + plan.date, JSON.stringify(updatedPlan));
    } catch {
      // Storage full or unavailable: keep the in-memory plan rather than crashing.
      return;
    }
    this.recordPlanDate(plan.date);
  }

  /**
   * Replaces a single routine block on a specific day with a new template snapshot.
   * Other blocks on that day and other days are untouched.
   */
  static replaceBlockWithTemplate(dateStr: string, category: TimeOfDay, templateId: string): DailyPlan {
    const plan = this.getDailyPlan(dateStr);
    const template = this.getTemplateById(templateId);

    if (template) {
      plan.blocks[category] = this.instantiateBlockFromTemplate(template);
    } else {
      plan.blocks[category] = this.createEmptyBlock(category);
    }

    this.saveDailyPlan(plan);
    return plan;
  }

  /**
   * Replaces a single routine block with a one-off custom routine.
   */
  static replaceBlockWithCustom(
    dateStr: string,
    category: TimeOfDay,
    title: string,
    sections: { title: string; tasks: { title: string; time?: string; notes?: string }[] }[]
  ): DailyPlan {
    const plan = this.getDailyPlan(dateStr);
    const customSections: DailyRoutineSection[] = sections.map((sec) => ({
      id: generateId(),
      title: sec.title.trim() || 'TASKS',
      tasks: sec.tasks.map((task) => ({
        id: generateId(),
        title: task.title.trim(),
        time: task.time?.trim() || undefined,
        notes: task.notes?.trim() || undefined,
        completed: false,
        isOneOff: true,
      })),
    }));

    plan.blocks[category] = {
      category,
      routineTitle: title.trim() || 'Custom Routine',
      isCustom: true,
      sections: customSections.length > 0 ? customSections : [
        { id: generateId(), title: 'TASKS', tasks: [] }
      ],
    };

    this.saveDailyPlan(plan);
    return plan;
  }

  /**
   * Clears a block for today (e.g. user is taking the afternoon off)
   */
  static clearBlock(dateStr: string, category: TimeOfDay): DailyPlan {
    const plan = this.getDailyPlan(dateStr);
    plan.blocks[category] = {
      category,
      routineTitle: 'Off / Free',
      isCustom: true,
      sections: [],
    };
    this.saveDailyPlan(plan);
    return plan;
  }

  /**
   * Reverts a block to the default schedule rule for this weekday
   */
  static revertBlockToSchedule(dateStr: string, category: TimeOfDay): DailyPlan {
    const dateObj = parseDateKey(dateStr);
    const dayOfWeek = dateObj.getDay() as DayOfWeek;
    const schedule = this.getWeeklySchedule();
    const templateId = schedule[dayOfWeek]?.[category];

    if (templateId) {
      return this.replaceBlockWithTemplate(dateStr, category, templateId);
    } else {
      return this.clearBlock(dateStr, category);
    }
  }

  /**
   * Adds a one-off task directly to a specific block section on today's plan.
   * Does NOT alter the reusable template.
   */
  static addOneOffTask(
    dateStr: string,
    category: TimeOfDay,
    taskData: { title: string; time?: string; notes?: string; sectionId?: string }
  ): DailyPlan {
    const plan = this.getDailyPlan(dateStr);
    const block = plan.blocks[category];

    const newTask: DailyTask = {
      id: generateId(),
      title: taskData.title.trim(),
      time: taskData.time?.trim() || undefined,
      notes: taskData.notes?.trim() || undefined,
      completed: false,
      isOneOff: true,
    };

    // Find section or append to first/default section
    let targetSection = block.sections.find((s) => s.id === taskData.sectionId);
    if (!targetSection) {
      if (block.sections.length === 0) {
        targetSection = {
          id: generateId(),
          title: 'TASKS',
          tasks: [],
        };
        block.sections.push(targetSection);
      } else {
        targetSection = block.sections[0];
      }
    }

    targetSection.tasks.push(newTask);
    this.saveDailyPlan(plan);
    return plan;
  }

  /**
   * Toggles task completion on a specific day
   */
  static toggleTask(dateStr: string, taskId: string): DailyPlan {
    const plan = this.getDailyPlan(dateStr);
    const updated = togglePlanTask(plan, taskId);
    if (updated !== plan) {
      this.saveDailyPlan(updated);
    }
    return updated;
  }

  /**
   * Deletes a one-off or scheduled task from today's plan
   */
  static deleteDailyTask(dateStr: string, taskId: string): DailyPlan {
    const plan = this.getDailyPlan(dateStr);
    const updated = removePlanTask(plan, taskId);
    if (updated !== plan) {
      this.saveDailyPlan(updated);
    }
    return updated;
  }

  // ================= BACKUP & RESTORE =================

  static exportData(): string {
    const data: Record<string, unknown> = {
      version: 1,
      exportedAt: new Date().toISOString(),
      templates: this.getTemplates(),
      schedule: this.getWeeklySchedule(),
      planDates: this.getStoredPlanDates(),
      plans: {} as Record<string, DailyPlan>,
    };

    const dates = this.getStoredPlanDates();
    dates.forEach((d) => {
      const key = STORAGE_KEYS.DAILY_PREFIX + d;
      const raw = localStorage.getItem(key);
      if (raw) {
        (data.plans as Record<string, DailyPlan>)[d] = JSON.parse(raw);
      }
    });

    return JSON.stringify(data, null, 2);
  }

  static importData(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (!Array.isArray(data.templates) || !data.schedule) {
        return false;
      }

      // Templates and schedules are read from blueprint-scoped keys, so imports must
      // land there too; writing only the legacy flat keys made import a silent no-op.
      this.saveTemplates(data.templates);
      this.saveWeeklySchedule(data.schedule);

      if (data.plans && typeof data.plans === 'object') {
        const dates: string[] = [];
        for (const [dateKey, planObj] of Object.entries(data.plans)) {
          writeJSON(STORAGE_KEYS.DAILY_PREFIX + dateKey, planObj);
          dates.push(dateKey);
        }
        writeJSON(STORAGE_KEYS.PLAN_INDEX, dates.sort((a, b) => b.localeCompare(a)));
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wipes DayCraft's own data only. This used to call `localStorage.clear()`, which
   * also destroyed unrelated keys on the same origin.
   */
  static resetToDefaults(): void {
    try {
      const ownKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(KEY_PREFIX)) ownKeys.push(key);
      }
      ownKeys.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
    readCache.clear();

    writeJSON(STORAGE_KEYS.TEMPLATES, DEFAULT_ROUTINES);
    writeJSON(STORAGE_KEYS.SCHEDULE, DEFAULT_WEEKLY_SCHEDULE);
  }
}

// Auto-purge any pre-install records once the app is idle. This walks every key in
// localStorage, so it stays off the module-evaluation path that blocks first paint.
if (typeof window !== 'undefined') {
  const purge = () => {
    try {
      StorageService.purgePreInstallPlans();
    } catch {
      // ignore in non-browser environments
    }
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(purge, { timeout: 2000 });
  } else {
    setTimeout(purge, 0);
  }
}
