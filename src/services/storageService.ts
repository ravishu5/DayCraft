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

export class StorageService {
  // ================= PERSONA / ONBOARDING =================

  static getSelectedPersona(): RoutinePersona | null {
    try {
      const p = localStorage.getItem(STORAGE_KEYS.SELECTED_PERSONA);
      if (p && ['corporate', 'student', 'govt_aspirant', 'general'].includes(p)) {
        return p as RoutinePersona;
      }
      return null;
    } catch {
      return null;
    }
  }

  static setSelectedPersona(persona: RoutinePersona): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_PERSONA, persona);
      localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
      localStorage.setItem('daycraft_onboarded_v3', 'true');
    } catch {
      // ignore
    }
  }

  static hasSelectedPersona(): boolean {
    try {
      if (this.getSelectedPersona() !== null) {
        return true;
      }
      // Check legacy or onboarding completion flags
      if (
        localStorage.getItem(STORAGE_KEYS.ONBOARDED) === 'true' ||
        localStorage.getItem('daycraft_onboarded_v3') === 'true' ||
        localStorage.getItem('daycraft_onboarded_v2') === 'true' ||
        localStorage.getItem('daycraft_onboarded_v1') === 'true'
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
    const activePersona = this.getSelectedPersona() || 'govt_aspirant';
    const personaKey = STORAGE_KEYS.PERSONA_TEMPLATES_PREFIX + activePersona;
    try {
      const data = localStorage.getItem(personaKey);
      if (data) {
        const loaded: RoutineTemplate[] = JSON.parse(data);
        localStorage.setItem(STORAGE_KEYS.TEMPLATES, data);
        return loaded;
      }
    } catch {
      // ignore
    }

    // First time for this persona: initialize with this blueprint's defaults
    const defaults = this.getDefaultTemplatesForPersona(activePersona);
    try {
      const json = JSON.stringify(defaults);
      localStorage.setItem(personaKey, json);
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, json);
    } catch {
      // ignore
    }
    return defaults;
  }

  static getTemplateById(id: string): RoutineTemplate | undefined {
    const templates = this.getTemplates();
    return templates.find((t) => t.id === id);
  }

  static saveTemplates(templates: RoutineTemplate[]): void {
    const activePersona = this.getSelectedPersona() || 'govt_aspirant';
    const personaKey = STORAGE_KEYS.PERSONA_TEMPLATES_PREFIX + activePersona;
    try {
      const json = JSON.stringify(templates);
      localStorage.setItem(personaKey, json);
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, json);
    } catch {
      // ignore
    }
  }

  /**
   * Adds or updates a routine in the CURRENT blueprint only.
   * It persists permanently under this blueprint even when switching back and forth.
   */
  static saveTemplate(template: RoutineTemplate): void {
    const activePersona = this.getSelectedPersona() || 'govt_aspirant';
    const templates = this.getTemplates();
    const index = templates.findIndex((t) => t.id === template.id);
    const updated: RoutineTemplate = {
      ...template,
      persona: activePersona,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      templates[index] = updated;
    } else {
      templates.push(updated);
    }
    this.saveTemplates(templates);
  }

  static deleteTemplate(id: string): void {
    const templates = this.getTemplates().filter((t) => t.id !== id);
    this.saveTemplates(templates);
  }

  static duplicateTemplate(id: string): RoutineTemplate | null {
    const original = this.getTemplateById(id);
    if (!original) return null;

    const activePersona = this.getSelectedPersona() || 'govt_aspirant';
    const cloned: RoutineTemplate = {
      ...original,
      id: generateId(),
      persona: activePersona,
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
    const activePersona = this.getSelectedPersona() || 'corporate';
    const personaKey = STORAGE_KEYS.PERSONA_SCHEDULE_PREFIX + activePersona;
    try {
      const data = localStorage.getItem(personaKey);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }

    const defaultSched = this.getDefaultScheduleForPersona(activePersona);
    try {
      const json = JSON.stringify(defaultSched);
      localStorage.setItem(personaKey, json);
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, json);
    } catch {
      // ignore
    }
    return defaultSched;
  }

  /**
   * Saves the weekly schedule for the active blueprint.
   */
  static saveWeeklySchedule(schedule: WeeklySchedule): void {
    const activePersona = this.getSelectedPersona() || 'corporate';
    const personaKey = STORAGE_KEYS.PERSONA_SCHEDULE_PREFIX + activePersona;
    try {
      const json = JSON.stringify(schedule);
      localStorage.setItem(personaKey, json);
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, json);
    } catch {
      // ignore
    }
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
      const daySchedule = sched[dayOfWeek] || {
        morning: null,
        afternoon: null,
        evening: null,
        bedtime: null,
      };

      const plan = this.getDailyPlan(dateKey);
      const categories: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'bedtime'];
      categories.forEach((cat) => {
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

  static getInstallDate(): string {
    try {
      let date = localStorage.getItem(STORAGE_KEYS.INSTALL_DATE);
      if (!date) {
        date = formatDateKey(new Date());
        localStorage.setItem(STORAGE_KEYS.INSTALL_DATE, date);
      }
      return date;
    } catch {
      return formatDateKey(new Date());
    }
  }

  static purgePreInstallPlans(): void {
    try {
      const installDate = this.getInstallDate();
      const data = localStorage.getItem(STORAGE_KEYS.PLAN_INDEX);
      if (data) {
        const list: string[] = JSON.parse(data);
        const filtered = list.filter((d) => d >= installDate);
        localStorage.setItem(STORAGE_KEYS.PLAN_INDEX, JSON.stringify(filtered));
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
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  }

  static getStoredPlanDates(): string[] {
    try {
      const installDate = this.getInstallDate();
      const data = localStorage.getItem(STORAGE_KEYS.PLAN_INDEX);
      if (!data) return [];
      const list: string[] = JSON.parse(data);
      const valid = list.filter((d) => d >= installDate);
      return valid.sort((a, b) => b.localeCompare(a));
    } catch {
      return [];
    }
  }

  private static recordPlanDate(dateStr: string): void {
    const installDate = this.getInstallDate();
    if (dateStr < installDate) return;

    const dates = new Set(this.getStoredPlanDates());
    dates.add(dateStr);
    const sorted = Array.from(dates).sort((a, b) => b.localeCompare(a));
    localStorage.setItem(STORAGE_KEYS.PLAN_INDEX, JSON.stringify(sorted));
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
  static getDailyPlan(dateStr: string): DailyPlan {
    const storageKey = STORAGE_KEYS.DAILY_PREFIX + dateStr;
    try {
      const existing = localStorage.getItem(storageKey);
      if (existing) {
        return JSON.parse(existing);
      }
    } catch {
      // fallback to creating fresh plan
    }

    // Build fresh daily plan from schedule rules
    const dateObj = parseDateKey(dateStr);
    const dayOfWeek = dateObj.getDay() as DayOfWeek;
    const schedule = this.getWeeklySchedule();
    const daySchedule = schedule[dayOfWeek] || {
      morning: null,
      afternoon: null,
      evening: null,
      bedtime: null,
    };

    const categories: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'bedtime'];
    const blocks: Record<TimeOfDay, DailyRoutineBlock> = {} as Record<TimeOfDay, DailyRoutineBlock>;

    categories.forEach((cat) => {
      const templateId = daySchedule[cat];
      if (templateId) {
        const template = this.getTemplateById(templateId);
        if (template) {
          blocks[cat] = this.instantiateBlockFromTemplate(template);
          return;
        }
      }
      blocks[cat] = this.createEmptyBlock(cat);
    });

    const newPlan: DailyPlan = {
      date: dateStr,
      blocks,
      lastModified: new Date().toISOString(),
    };

    const installDate = this.getInstallDate();
    if (dateStr >= installDate) {
      this.saveDailyPlan(newPlan);
    }
    return newPlan;
  }

  static saveDailyPlan(plan: DailyPlan): void {
    const installDate = this.getInstallDate();
    if (plan.date < installDate) return;

    const storageKey = STORAGE_KEYS.DAILY_PREFIX + plan.date;
    const updatedPlan: DailyPlan = {
      ...plan,
      lastModified: new Date().toISOString(),
    };
    localStorage.setItem(storageKey, JSON.stringify(updatedPlan));
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
    let found = false;

    const categories: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'bedtime'];
    for (const cat of categories) {
      const block = plan.blocks[cat];
      if (!block) continue;
      for (const sec of block.sections) {
        const task = sec.tasks.find((t) => t.id === taskId);
        if (task) {
          task.completed = !task.completed;
          task.completedAt = task.completed ? new Date().toISOString() : undefined;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (found) {
      this.saveDailyPlan(plan);
    }
    return plan;
  }

  /**
   * Deletes a one-off or scheduled task from today's plan
   */
  static deleteDailyTask(dateStr: string, taskId: string): DailyPlan {
    const plan = this.getDailyPlan(dateStr);
    const categories: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'bedtime'];

    for (const cat of categories) {
      const block = plan.blocks[cat];
      if (!block) continue;
      for (const sec of block.sections) {
        sec.tasks = sec.tasks.filter((t) => t.id !== taskId);
      }
    }

    this.saveDailyPlan(plan);
    return plan;
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
      if (!data.templates || !data.schedule) {
        return false;
      }

      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(data.templates));
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(data.schedule));

      if (data.plans && typeof data.plans === 'object') {
        const dates: string[] = [];
        for (const [dateKey, planObj] of Object.entries(data.plans)) {
          localStorage.setItem(STORAGE_KEYS.DAILY_PREFIX + dateKey, JSON.stringify(planObj));
          dates.push(dateKey);
        }
        localStorage.setItem(STORAGE_KEYS.PLAN_INDEX, JSON.stringify(dates));
      }

      return true;
    } catch {
      return false;
    }
  }

  static resetToDefaults(): void {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(DEFAULT_ROUTINES));
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(DEFAULT_WEEKLY_SCHEDULE));
  }
}

// Auto-purge any pre-install records on initialization
try {
  StorageService.purgePreInstallPlans();
} catch {
  // ignore in non-browser environments
}
