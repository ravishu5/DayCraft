import type { WeeklySchedule } from '../types';

// =========================================================================
// CORPORATE WORKER SCHEDULE
// =========================================================================
export const DEFAULT_CORPORATE_SCHEDULE: WeeklySchedule = {
  // Sunday (0)
  0: {
    morning: 'template-morning-wfh-focus',
    afternoon: 'template-afternoon-corporate-wfh',
    evening: 'template-evening-corporate-gym',
    bedtime: 'template-bedtime-corporate-winddown',
  },
  // Monday (1) - Office Commute
  1: {
    morning: 'template-morning-office-commute',
    afternoon: 'template-afternoon-corporate-office',
    evening: 'template-evening-corporate-gym',
    bedtime: 'template-bedtime-corporate-winddown',
  },
  // Tuesday (2) - Office Commute & Syncs
  2: {
    morning: 'template-morning-office-commute',
    afternoon: 'template-afternoon-corporate-office',
    evening: 'template-evening-corporate-gym',
    bedtime: 'template-bedtime-corporate-winddown',
  },
  // Wednesday (3) - High Stake Meetings
  3: {
    morning: 'template-morning-exec-meetings',
    afternoon: 'template-afternoon-corporate-office',
    evening: 'template-evening-corporate-social',
    bedtime: 'template-bedtime-corporate-winddown',
  },
  // Thursday (4) - Office & Networking
  4: {
    morning: 'template-morning-office-commute',
    afternoon: 'template-afternoon-corporate-office',
    evening: 'template-evening-corporate-social',
    bedtime: 'template-bedtime-corporate-winddown',
  },
  // Friday (5) - WFH Focus
  5: {
    morning: 'template-morning-wfh-focus',
    afternoon: 'template-afternoon-corporate-wfh',
    evening: 'template-evening-corporate-social',
    bedtime: 'template-bedtime-corporate-winddown',
  },
  // Saturday (6) - Rest & Recovery
  6: {
    morning: 'template-morning-wfh-focus',
    afternoon: 'template-afternoon-corporate-wfh',
    evening: 'template-evening-corporate-gym',
    bedtime: 'template-bedtime-corporate-winddown',
  },
};

// =========================================================================
// UNIVERSITY & COLLEGE STUDENT SCHEDULE
// =========================================================================
export const DEFAULT_STUDENT_SCHEDULE: WeeklySchedule = {
  // Sunday (0) - Library prep & early bedtime
  0: {
    morning: 'template-morning-student-library',
    afternoon: 'template-afternoon-student-campus',
    evening: 'template-evening-student-homework',
    bedtime: 'template-bedtime-student-reset',
  },
  // Monday (1) - Lectures & Assignment Sprint
  1: {
    morning: 'template-morning-student-campus',
    afternoon: 'template-afternoon-student-campus',
    evening: 'template-evening-student-homework',
    bedtime: 'template-bedtime-student-reset',
  },
  // Tuesday (2) - Lectures & Group Project
  2: {
    morning: 'template-morning-student-campus',
    afternoon: 'template-afternoon-student-groupproject',
    evening: 'template-evening-student-club',
    bedtime: 'template-bedtime-student-reset',
  },
  // Wednesday (3) - Lectures & Lab
  3: {
    morning: 'template-morning-student-campus',
    afternoon: 'template-afternoon-student-campus',
    evening: 'template-evening-student-homework',
    bedtime: 'template-bedtime-student-reset',
  },
  // Thursday (4) - Group Presentation & Society
  4: {
    morning: 'template-morning-student-campus',
    afternoon: 'template-afternoon-student-groupproject',
    evening: 'template-evening-student-club',
    bedtime: 'template-bedtime-student-reset',
  },
  // Friday (5) - Classes & Weekend Kickoff
  5: {
    morning: 'template-morning-student-campus',
    afternoon: 'template-afternoon-student-campus',
    evening: 'template-evening-student-club',
    bedtime: 'template-bedtime-student-reset',
  },
  // Saturday (6) - Weekend Library Sprint
  6: {
    morning: 'template-morning-student-library',
    afternoon: 'template-afternoon-student-groupproject',
    evening: 'template-evening-student-club',
    bedtime: 'template-bedtime-student-reset',
  },
};

// =========================================================================
// GOVT EXAM ASPIRANT (FULL-TIME SELF-STUDY) SCHEDULE
// =========================================================================
export const DEFAULT_GOVT_ASPIRANT_SCHEDULE: WeeklySchedule = {
  // Sunday (0) - Comprehensive Weekly Revision & Mock
  0: {
    morning: 'template-morning-govt-revision-pyqs',
    afternoon: 'template-afternoon-govt-slot2',
    evening: 'template-evening-govt-mocktest',
    bedtime: 'template-bedtime-govt-winddown',
  },
  // Monday (1) - Editorial, GS1, Optional & Mock
  1: {
    morning: 'template-morning-govt-editorial-gs1',
    afternoon: 'template-afternoon-govt-slot2',
    evening: 'template-evening-govt-mocktest',
    bedtime: 'template-bedtime-govt-winddown',
  },
  // Tuesday (2) - Editorial, GS1, Optional & Mock
  2: {
    morning: 'template-morning-govt-editorial-gs1',
    afternoon: 'template-afternoon-govt-slot2',
    evening: 'template-evening-govt-mocktest',
    bedtime: 'template-bedtime-govt-winddown',
  },
  // Wednesday (3) - Editorial, GS1, Optional & Mock
  3: {
    morning: 'template-morning-govt-editorial-gs1',
    afternoon: 'template-afternoon-govt-slot2',
    evening: 'template-evening-govt-mocktest',
    bedtime: 'template-bedtime-govt-winddown',
  },
  // Thursday (4) - Editorial, GS1, Optional & Mock
  4: {
    morning: 'template-morning-govt-editorial-gs1',
    afternoon: 'template-afternoon-govt-slot2',
    evening: 'template-evening-govt-mocktest',
    bedtime: 'template-bedtime-govt-winddown',
  },
  // Friday (5) - Editorial, GS1, Optional & Mock
  5: {
    morning: 'template-morning-govt-editorial-gs1',
    afternoon: 'template-afternoon-govt-slot2',
    evening: 'template-evening-govt-mocktest',
    bedtime: 'template-bedtime-govt-winddown',
  },
  // Saturday (6) - PYQs & Intensive Answer Writing
  6: {
    morning: 'template-morning-govt-revision-pyqs',
    afternoon: 'template-afternoon-govt-slot2',
    evening: 'template-evening-govt-mocktest',
    bedtime: 'template-bedtime-govt-winddown',
  },
};

// =========================================================================
// GENERAL LIFESTYLE SCHEDULE
// =========================================================================
export const DEFAULT_GENERAL_SCHEDULE: WeeklySchedule = {
  0: {
    morning: 'template-morning-general-fresh',
    afternoon: 'template-afternoon-general-focus',
    evening: 'template-evening-general-unwind',
    bedtime: 'template-bedtime-early-rest',
  },
  1: {
    morning: 'template-morning-general-fresh',
    afternoon: 'template-afternoon-general-focus',
    evening: 'template-evening-general-unwind',
    bedtime: 'template-bedtime-early-rest',
  },
  2: {
    morning: 'template-morning-general-fresh',
    afternoon: 'template-afternoon-general-focus',
    evening: 'template-evening-general-unwind',
    bedtime: 'template-bedtime-early-rest',
  },
  3: {
    morning: 'template-morning-general-fresh',
    afternoon: 'template-afternoon-general-focus',
    evening: 'template-evening-general-unwind',
    bedtime: 'template-bedtime-early-rest',
  },
  4: {
    morning: 'template-morning-general-fresh',
    afternoon: 'template-afternoon-general-focus',
    evening: 'template-evening-general-unwind',
    bedtime: 'template-bedtime-early-rest',
  },
  5: {
    morning: 'template-morning-general-fresh',
    afternoon: 'template-afternoon-general-focus',
    evening: 'template-evening-general-unwind',
    bedtime: 'template-bedtime-early-rest',
  },
  6: {
    morning: 'template-morning-general-fresh',
    afternoon: 'template-afternoon-general-focus',
    evening: 'template-evening-general-unwind',
    bedtime: 'template-bedtime-early-rest',
  },
};

// Default active weekly schedule
export const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = DEFAULT_CORPORATE_SCHEDULE;
