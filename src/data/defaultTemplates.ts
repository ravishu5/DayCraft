import type { RoutineTemplate } from '../types';

export const DEFAULT_ROUTINES: RoutineTemplate[] = [
  // =========================================================================
  // 🌅 MORNING ROUTINES
  // =========================================================================

  // --- CORPORATE ---
  {
    id: 'template-morning-office-commute',
    category: 'morning',
    persona: 'corporate',
    title: 'Office Commute Morning',
    description: 'Structured prep, commute and standup readiness for office days',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-oc-1',
        title: 'GET READY',
        tasks: [
          { id: 't-oc-1', title: 'Wake up, glass of water & stretch', time: '06:30' },
          { id: 't-oc-2', title: 'Shower & business casual attire', time: '06:50' },
          { id: 't-oc-3', title: 'Healthy breakfast & espresso', time: '07:15', notes: 'Fuel before transit' },
        ],
      },
      {
        id: 'sec-oc-2',
        title: 'COMMUTE & KICKOFF',
        tasks: [
          { id: 't-oc-4', title: 'Pack laptop, charger & badge', time: '07:45' },
          { id: 't-oc-5', title: 'Transit / train ride with industry podcast', time: '08:00' },
          { id: 't-oc-6', title: 'Scan calendar & prepare for morning standup', time: '08:50', notes: 'Identify top 3 deliverables' },
        ],
      },
    ],
  },
  {
    id: 'template-morning-wfh-focus',
    category: 'morning',
    persona: 'corporate',
    title: 'WFH Deep Focus Morning',
    description: 'Zero-commute morning maximizing early deep work before meetings',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-wf-1',
        title: 'MORNING RHYTHM',
        tasks: [
          { id: 't-wf-1', title: 'Natural wake up & quick walk or sunlight', time: '07:15' },
          { id: 't-wf-2', title: 'Fresh pour-over coffee & breakfast', time: '07:40' },
        ],
      },
      {
        id: 'sec-wf-2',
        title: 'DESK SETUP & SPRINT',
        tasks: [
          { id: 't-wf-3', title: 'Clear desk & fill 1L water bottle', time: '08:15' },
          { id: 't-wf-4', title: '90-min deep work sprint (No Slack pings)', time: '08:30', notes: 'Hardest task first' },
          { id: 't-wf-5', title: 'Async Slack standup & email triage', time: '10:00' },
        ],
      },
    ],
  },
  {
    id: 'template-morning-exec-meetings',
    category: 'morning',
    persona: 'corporate',
    title: 'Client & Stakeholder Morning',
    description: 'High-stakes day with presentations, client briefings and syncs',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-ex-1',
        title: 'PREPARATION',
        tasks: [
          { id: 't-ex-1', title: 'Early wake up & sharp grooming', time: '06:15' },
          { id: 't-ex-2', title: 'Review slide decks & talking points', time: '07:00' },
          { id: 't-ex-3', title: 'Verify presentation clicker & adapter cables', time: '07:30' },
        ],
      },
      {
        id: 'sec-ex-2',
        title: 'ONSITE SYNC',
        tasks: [
          { id: 't-ex-4', title: 'Arrive 20 mins early at venue/room', time: '08:40' },
          { id: 't-ex-5', title: 'Test mic, display screen & Zoom link', time: '08:50' },
        ],
      },
    ],
  },

  // --- STUDENT ---
  {
    id: 'template-morning-student-campus',
    category: 'morning',
    persona: 'student',
    title: 'Campus Lecture Morning',
    description: 'Energized morning routine for early university lectures & classes',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-sc-1',
        title: 'WAKE & FUEL',
        tasks: [
          { id: 't-sc-1', title: 'Alarm, splash cold water & drink glass of water', time: '07:00' },
          { id: 't-sc-2', title: 'Quick protein breakfast & coffee/tea', time: '07:20' },
        ],
      },
      {
        id: 'sec-sc-2',
        title: 'BACKPACK CHECK & COMMUTE',
        tasks: [
          { id: 't-sc-3', title: 'Pack laptop, charger, student ID & notebook', time: '07:45' },
          { id: 't-sc-4', title: 'Commute to campus / walk to lecture hall', time: '08:10' },
          { id: 't-sc-5', title: 'Grab front/middle seat 10 mins before start', time: '08:50', notes: 'Open slides or syllabus' },
        ],
      },
    ],
  },
  {
    id: 'template-morning-student-exam',
    category: 'morning',
    persona: 'student',
    title: 'Exam Day Morning',
    description: 'Calm, confident morning ritual designed for zero panic on test day',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-se-1',
        title: 'CALM NUTRITION',
        tasks: [
          { id: 't-se-1', title: 'Gentle wake up & light breakfast (oats/banana)', time: '06:45' },
          { id: 't-se-2', title: '15-min calm glance at high-yield formulas', time: '07:15', notes: 'No new topics or cramming' },
        ],
      },
      {
        id: 'sec-se-2',
        title: 'EXAM GEAR & TRANSIT',
        tasks: [
          { id: 't-se-3', title: 'Check exam kit: ID, pens, pencils, calculator, watch', time: '07:45' },
          { id: 't-se-4', title: 'Arrive at examination hall 25 mins early', time: '08:35' },
          { id: 't-se-5', title: '5 min deep box breathing & hydrate', time: '08:50' },
        ],
      },
    ],
  },
  {
    id: 'template-morning-student-library',
    category: 'morning',
    persona: 'student',
    title: 'Library Study Morning',
    description: 'Quiet weekend or reading-day morning sprint at the university library',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-sl-1',
        title: 'GET READY',
        tasks: [
          { id: 't-sl-1', title: 'Casual hoodie, fill insulated water bottle & snacks', time: '08:00' },
          { id: 't-sl-2', title: 'Grab coffee and head to library opening', time: '08:30' },
        ],
      },
      {
        id: 'sec-sl-2',
        title: 'DEEP STUDY BLOCK',
        tasks: [
          { id: 't-sl-3', title: 'Claim quiet desk with power outlet', time: '09:00' },
          { id: 't-sl-4', title: 'Phone on Do Not Disturb', time: '09:05' },
          { id: 't-sl-5', title: 'Complete first 2h textbook reading/problem set', time: '09:15' },
        ],
      },
    ],
  },

  // --- GOVT EXAM ASPIRANT (FULL-TIME SELF-STUDY) ---
  {
    id: 'template-morning-govt-editorial-gs1',
    category: 'morning',
    persona: 'govt_aspirant',
    title: 'Editorial & GS Study Slot 1',
    description: 'Disciplined dawn routine: newspaper analysis and deep static subject study',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-gme-1',
        title: 'EARLY HEALTH & RESET',
        tasks: [
          { id: 't-gme-1', title: '5:30 AM wake up & warm lemon water', time: '05:30' },
          { id: 't-gme-2', title: '15 min Surya Namaskar or light stretch', time: '05:45' },
        ],
      },
      {
        id: 'sec-gme-2',
        title: 'NEWSPAPER & EDITORIALS',
        tasks: [
          { id: 't-gme-3', title: 'The Hindu / Indian Express editorial reading', time: '06:15' },
          { id: 't-gme-4', title: 'Jot down keyword notes & issue pointers', time: '07:15', notes: 'Maintain syllabus mapping' },
          { id: 't-gme-5', title: 'Nutritious breakfast & black coffee/tea', time: '07:45' },
        ],
      },
      {
        id: 'sec-gme-3',
        title: 'GS SLOT 1 (DEEP STUDY)',
        tasks: [
          { id: 't-gme-6', title: 'Core static subject (Polity / Economy / History)', time: '08:15', notes: '2.5h uninterrupted deep focus' },
          { id: 't-gme-7', title: 'Quick chapter summary & active recall check', time: '10:45' },
        ],
      },
    ],
  },
  {
    id: 'template-morning-govt-revision-pyqs',
    category: 'morning',
    persona: 'govt_aspirant',
    title: 'Daily Revision & PYQ Drill',
    description: 'High-yield morning focused on previous year questions and memory retention',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-gmr-1',
        title: 'REVISION & DRILL',
        tasks: [
          { id: 't-gmr-1', title: 'Wake up, hydration & light breakfast', time: '06:00' },
          { id: 't-gmr-2', title: 'Revise yesterday short notes & formula sheets', time: '06:45' },
          { id: 't-gmr-3', title: 'Solve 50 Previous Year Questions topic-wise', time: '07:45', notes: 'Focus on question patterns' },
          { id: 't-gmr-4', title: 'Review explanations for all incorrect attempts', time: '09:00' },
        ],
      },
    ],
  },

  // --- GENERAL LIFESTYLE ---
  {
    id: 'template-morning-general-fresh',
    category: 'morning',
    persona: 'general',
    title: 'Mindful Morning Fresh Start',
    description: 'Gentle wake up, hydration, mindful movement, and planning the day',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-gmf-1',
        title: 'WAKE & NOURISH',
        tasks: [
          { id: 't-gmf-1', title: 'Wake up & drink large glass of water', time: '07:00' },
          { id: 't-gmf-2', title: 'Light stretching or morning stroll in sunlight', time: '07:15' },
          { id: 't-gmf-3', title: 'Nutritious breakfast & coffee or herbal tea', time: '07:45' },
        ],
      },
      {
        id: 'sec-gmf-2',
        title: 'DAILY INTENTION',
        tasks: [
          { id: 't-gmf-4', title: 'Identify top 3 daily priorities in planner', time: '08:15', notes: 'One must-do priority first' },
          { id: 't-gmf-5', title: 'Clear workspace & start morning focus session', time: '08:30' },
        ],
      },
    ],
  },

  // =========================================================================
  // ☀️ AFTERNOON ROUTINES
  // =========================================================================

  // --- CORPORATE ---
  {
    id: 'template-afternoon-corporate-office',
    category: 'afternoon',
    persona: 'corporate',
    title: 'Corporate Office Afternoon',
    description: 'Balancing team meetings, cross-functional syncs and wrap-up',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-cao-1',
        title: 'MIDDAY RESET',
        tasks: [
          { id: 't-cao-1', title: 'Lunch away from desk with colleagues', time: '12:30', notes: 'Full 45 min screen break' },
          { id: 't-cao-2', title: '10-minute fresh air outdoor walk', time: '13:15' },
        ],
      },
      {
        id: 'sec-cao-2',
        title: 'COLLABORATION & WRAP-UP',
        tasks: [
          { id: 't-cao-3', title: 'Internal syncs & 1-on-1 meetings', time: '14:00' },
          { id: 't-cao-4', title: 'Clear high-priority email & Slack replies', time: '16:00' },
          { id: 't-cao-5', title: 'Update Jira/project tracker & write tomorrow notes', time: '17:00' },
          { id: 't-cao-6', title: 'Pack work bag & head out', time: '17:30' },
        ],
      },
    ],
  },
  {
    id: 'template-afternoon-corporate-wfh',
    category: 'afternoon',
    persona: 'corporate',
    title: 'WFH Sprint Afternoon',
    description: 'Uninterrupted productivity sprint followed by a clean workday shutdown',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-caw-1',
        title: 'LUNCH & UNPLUG',
        tasks: [
          { id: 't-caw-1', title: 'Cook fresh lunch & eat screen-free', time: '12:30' },
          { id: 't-caw-2', title: 'Quick posture stretch & hydration refill', time: '13:15' },
        ],
      },
      {
        id: 'sec-caw-2',
        title: 'FOCUS SPRINT & SHUTDOWN',
        tasks: [
          { id: 't-caw-3', title: 'Afternoon execution sprint', time: '13:45', notes: 'Deliverable completion' },
          { id: 't-caw-4', title: 'Green tea break', time: '15:30' },
          { id: 't-caw-5', title: 'Post EOD summary & shut laptop lid', time: '17:30', notes: 'Officially switch to personal time' },
        ],
      },
    ],
  },

  // --- STUDENT ---
  {
    id: 'template-afternoon-student-campus',
    category: 'afternoon',
    persona: 'student',
    title: 'Campus & Lab Afternoon',
    description: 'Post-lunch laboratory sessions, discussion groups and study blocks',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-sca-1',
        title: 'LUNCH & DECOMPRESS',
        tasks: [
          { id: 't-sca-1', title: 'Cafeteria lunch with friends', time: '12:30' },
          { id: 't-sca-2', title: 'Review lab sheet or seminar reading', time: '13:30' },
        ],
      },
      {
        id: 'sec-sca-2',
        title: 'LAB & ASSIGNMENT BLOCK',
        tasks: [
          { id: 't-sca-3', title: 'Attend lab session or discussion group', time: '14:00' },
          { id: 't-sca-4', title: 'Campus library focus: work on weekly problem set', time: '16:00' },
        ],
      },
    ],
  },
  {
    id: 'template-afternoon-student-groupproject',
    category: 'afternoon',
    persona: 'student',
    title: 'Group Project Afternoon',
    description: 'Collaborative team meeting, presentation preparation and rubric review',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-sgp-1',
        title: 'GROUP COLLABORATION',
        tasks: [
          { id: 't-sgp-1', title: 'Meet team in study breakout room', time: '14:00' },
          { id: 't-sgp-2', title: 'Review project rubric and assign remaining tasks', time: '14:15' },
          { id: 't-sgp-3', title: 'Collaborate on Google Slides / code repository', time: '14:45' },
          { id: 't-sgp-4', title: 'Confirm next deadline & wrap up', time: '16:30' },
        ],
      },
    ],
  },

  // --- GOVT EXAM ASPIRANT (FULL-TIME SELF-STUDY) ---
  {
    id: 'template-afternoon-govt-slot2',
    category: 'afternoon',
    persona: 'govt_aspirant',
    title: 'Optional Subject & CSAT Slot 2',
    description: 'Post-lunch power nap, optional paper mastery and aptitude speed drills',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-ga-1',
        title: 'LUNCH & RECHARGE',
        tasks: [
          { id: 't-ga-1', title: 'Light protein lunch (avoid food coma)', time: '12:30' },
          { id: 't-ga-2', title: '20-minute power nap & hydration', time: '13:00', notes: 'Reset cognitive alertness' },
        ],
      },
      {
        id: 'sec-ga-2',
        title: 'SLOT 2 - OPTIONAL / CORE GS',
        tasks: [
          { id: 't-ga-3', title: 'Optional paper reading or advanced topics', time: '13:30', notes: '2 hours dedicated study' },
          { id: 't-ga-4', title: 'Stand up, stretch & eye rest', time: '15:30' },
          { id: 't-ga-5', title: 'CSAT / Quantitative Aptitude & Reasoning speed test', time: '15:45' },
        ],
      },
    ],
  },

  // --- GENERAL LIFESTYLE ---
  {
    id: 'template-afternoon-general-focus',
    category: 'afternoon',
    persona: 'general',
    title: 'Productive Midday & Focus Block',
    description: 'Nourishing midday lunch, screen rest, and dedicated afternoon productivity sprint',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-gaf-1',
        title: 'MIDDAY RECHARGE',
        tasks: [
          { id: 't-gaf-1', title: 'Wholesome lunch away from screens', time: '12:30', notes: 'Hydrate & nourish' },
          { id: 't-gaf-2', title: '15-minute gentle outdoor walk or eye reset', time: '13:15' },
        ],
      },
      {
        id: 'sec-gaf-2',
        title: 'FOCUS SPRINT',
        tasks: [
          { id: 't-gaf-3', title: 'Deep focus block on high-value priority', time: '13:45', notes: 'Minimize interruptions' },
          { id: 't-gaf-4', title: 'Mid-afternoon tea/coffee & light stretch', time: '15:30' },
          { id: 't-gaf-5', title: 'Triage secondary tasks & messages', time: '16:00' },
        ],
      },
    ],
  },

  // =========================================================================
  // 🌆 EVENING ROUTINES
  // =========================================================================

  // --- CORPORATE ---
  {
    id: 'template-evening-corporate-gym',
    category: 'evening',
    persona: 'corporate',
    title: 'Corporate Gym & Recovery',
    description: 'Post-work workout to shake off desk stiffness followed by nourishing dinner',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-ceg-1',
        title: 'TRAINING',
        tasks: [
          { id: 't-ceg-1', title: 'Pre-workout snack & gym gear on', time: '17:45' },
          { id: 't-ceg-2', title: '50-min strength or cardio session', time: '18:15' },
          { id: 't-ceg-3', title: 'Post-workout cooldown & shower', time: '19:15' },
        ],
      },
      {
        id: 'sec-ceg-2',
        title: 'EVENING RESET',
        tasks: [
          { id: 't-ceg-4', title: 'High-protein dinner', time: '20:00' },
          { id: 't-ceg-5', title: 'Wash gym clothes & shaker bottle', time: '20:45' },
        ],
      },
    ],
  },
  {
    id: 'template-evening-corporate-social',
    category: 'evening',
    persona: 'corporate',
    title: 'Networking & Team Dinner',
    description: 'Corporate social meetup, client dinner or after-hours networking',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-ces-1',
        title: 'EVENING OUT',
        tasks: [
          { id: 't-ces-1', title: 'Freshen up & commute to dinner venue', time: '18:30' },
          { id: 't-ces-2', title: 'Team dinner & networking conversations', time: '19:15', notes: 'Pace drinks with sparkling water' },
          { id: 't-ces-3', title: 'Head home by 21:45 to protect sleep', time: '21:45' },
        ],
      },
    ],
  },

  // --- STUDENT ---
  {
    id: 'template-evening-student-homework',
    category: 'evening',
    persona: 'student',
    title: 'Assignment Sprint Evening',
    description: 'Dedicated homework session to clear problem sets before the midnight deadline',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-seh-1',
        title: 'DINNER & DESK SETUP',
        tasks: [
          { id: 't-seh-1', title: 'Dinner & short phone break', time: '18:30' },
          { id: 't-seh-2', title: 'Clear dorm desk & queue study playlist', time: '19:30' },
        ],
      },
      {
        id: 'sec-seh-2',
        title: 'DEADLINE FOCUS',
        tasks: [
          { id: 't-seh-3', title: 'Solve weekly assignment questions', time: '19:45' },
          { id: 't-seh-4', title: 'Check plagiarism/rubric & export PDF', time: '21:30' },
          { id: 't-seh-5', title: 'Submit to Canvas / Portal before 23:00', time: '22:00', notes: 'Verify submission confirmation receipt' },
        ],
      },
    ],
  },
  {
    id: 'template-evening-student-club',
    category: 'evening',
    persona: 'student',
    title: 'Student Society & Social',
    description: 'Campus society meeting, sports club practice or movie night with housemates',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-sec-1',
        title: 'CAMPUS SOCIAL',
        tasks: [
          { id: 't-sec-1', title: 'Attend society meeting or sports practice', time: '18:30' },
          { id: 't-sec-2', title: 'Grab dinner or bubble tea with friends', time: '20:00' },
          { id: 't-sec-3', title: 'Return to dorm & wash up', time: '21:30' },
        ],
      },
    ],
  },

  // --- GOVT EXAM ASPIRANT (FULL-TIME SELF-STUDY) ---
  {
    id: 'template-evening-govt-mocktest',
    category: 'evening',
    persona: 'govt_aspirant',
    title: 'Mock Test & Answer Writing',
    description: 'Timed exam simulation, mistake notebook analysis and evening mental detox',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-ge-1',
        title: 'SIMULATION & PRACTICE',
        tasks: [
          { id: 't-ge-1', title: 'Timed Mains answer writing (2 questions) or 1h mock test', time: '17:30' },
          { id: 't-ge-2', title: 'Enter wrong questions into Mistake Notebook', time: '18:45', notes: 'Crucial for revision' },
        ],
      },
      {
        id: 'sec-ge-2',
        title: 'PHYSICAL WELLBEING & DINNER',
        tasks: [
          { id: 't-ge-3', title: '30-minute brisk walk or run outside (Mental reset)', time: '19:30' },
          { id: 't-ge-4', title: 'Light dinner with family or listening to light music', time: '20:15' },
          { id: 't-ge-5', title: 'Wash up & prep desk for night session', time: '21:00' },
        ],
      },
    ],
  },

  // --- GENERAL LIFESTYLE ---
  {
    id: 'template-evening-general-unwind',
    category: 'evening',
    persona: 'general',
    title: 'Evening Flow & Unwind',
    description: 'Transitioning from day to evening: movement, dinner, family time and personal hobbies',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-gev-1',
        title: 'TRANSITION & MOVEMENT',
        tasks: [
          { id: 't-gev-1', title: 'Wrap up daily tasks & clear workspace', time: '17:30' },
          { id: 't-gev-2', title: 'Evening walk, workout, or fresh air movement', time: '18:00' },
        ],
      },
      {
        id: 'sec-gev-2',
        title: 'DINNER & DOWNTIME',
        tasks: [
          { id: 't-gev-3', title: 'Relaxed dinner with family or mindful meal', time: '19:30' },
          { id: 't-gev-4', title: 'Personal hobbies, reading, or music', time: '20:30' },
        ],
      },
    ],
  },

  // =========================================================================
  // 🌙 BEDTIME ROUTINES
  // =========================================================================

  // --- CORPORATE ---
  {
    id: 'template-bedtime-corporate-winddown',
    category: 'bedtime',
    persona: 'corporate',
    title: 'Executive Wind Down',
    description: 'Boundary setting, digital silence and mental decompression for quality sleep',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-cbw-1',
        title: 'PREPARE TOMORROW',
        tasks: [
          { id: 't-cbw-1', title: 'Close Slack & email on personal phone', time: '21:30', notes: 'No work pings in bed' },
          { id: 't-cbw-2', title: 'Layout work outfit & pack bag for tomorrow', time: '21:45' },
          { id: 't-cbw-3', title: 'Check tomorrow calendar first meeting time', time: '22:00' },
        ],
      },
      {
        id: 'sec-cbw-2',
        title: 'LIGHTS OUT',
        tasks: [
          { id: 't-cbw-4', title: 'Brush teeth & night skincare', time: '22:15' },
          { id: 't-cbw-5', title: 'Read fiction book for 15 mins (No screens)', time: '22:30' },
          { id: 't-cbw-6', title: 'Lights out & deep sleep', time: '22:50' },
        ],
      },
    ],
  },

  // --- STUDENT ---
  {
    id: 'template-bedtime-student-reset',
    category: 'bedtime',
    persona: 'student',
    title: 'Student Rest & Alarm Reset',
    description: 'Brain cool-down after study sprints and reliable multi-alarm setup',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-sbr-1',
        title: 'STUDY SHUTDOWN',
        tasks: [
          { id: 't-sbr-1', title: 'Close textbook, code IDE & lecture notes', time: '22:30', notes: 'Let the brain cool down' },
          { id: 't-sbr-2', title: 'Set alarms for morning lecture (leave phone across room)', time: '22:45' },
        ],
      },
      {
        id: 'sec-sbr-2',
        title: 'REST',
        tasks: [
          { id: 't-sbr-3', title: 'Brush teeth & drink small glass of water', time: '23:00' },
          { id: 't-sbr-4', title: 'Listen to ambient sleep sounds or read', time: '23:15' },
          { id: 't-sbr-5', title: 'Lights out for 8 hours sleep', time: '23:30' },
        ],
      },
    ],
  },
  {
    id: 'template-bedtime-early-rest',
    category: 'bedtime',
    persona: 'general',
    title: 'Early Recovery Sleep',
    description: 'Early night before an exam, long commute or presentation day',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-gbe-1',
        title: 'EARLY REST',
        tasks: [
          { id: 't-gbe-1', title: 'All screens off by 21:00', time: '21:00' },
          { id: 't-gbe-2', title: 'Warm shower & lavender or chamomile tea', time: '21:15' },
          { id: 't-gbe-3', title: 'Dark, quiet room & sleep mask', time: '21:45' },
        ],
      },
    ],
  },

  // --- GOVT EXAM ASPIRANT (FULL-TIME SELF-STUDY) ---
  {
    id: 'template-bedtime-govt-winddown',
    category: 'bedtime',
    persona: 'govt_aspirant',
    title: 'Daily Study Audit & Sleep Reset',
    description: 'Hour audit, next-day syllabus planning, current affairs summary and early sleep',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sections: [
      {
        id: 'sec-gb-1',
        title: 'NIGHT RECAP & AUDIT',
        tasks: [
          { id: 't-gb-1', title: 'Read Monthly Current Affairs Magazine compilation (30 mins)', time: '21:30' },
          { id: 't-gb-2', title: 'Daily study audit: Log hours studied & chapters completed', time: '22:00' },
          { id: 't-gb-3', title: 'Write tomorrow 3 study targets & arrange books', time: '22:15' },
        ],
      },
      {
        id: 'sec-gb-2',
        title: 'LIGHTS OUT',
        tasks: [
          { id: 't-gb-4', title: 'Phone on airplane mode placed away from bed', time: '22:30' },
          { id: 't-gb-5', title: 'Lights out & sleep for 7 hours (wake at 5:30 AM)', time: '22:35' },
        ],
      },
    ],
  },
];
