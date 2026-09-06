# DayCraft · Daily Routine & Timetable Planner

<p align="center">
  <img src="public/icon-512.png" width="120" height="120" alt="DayCraft Icon" style="border-radius: 28px;" />
</p>

<p align="center">
  <strong>A calm, modular routine composer tailored to how you live.</strong><br>
  Build your ideal day by combining tailored routines for Morning, Afternoon, Evening, and Bedtime.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Capacitor-7-119EFF?logo=capacitor&logoColor=white" alt="Capacitor 7" />
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20Web%20PWA-green" alt="Platforms" />
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License" />
</p>

---

## 🌿 Philosophy: Not a Habit Tracker

DayCraft is built around an intentional, burnout-free principle:

> **Users build their day by combining different routine types for Morning (🌅), Afternoon (☀️), Evening (🌆), and Bedtime (🌙).**

- ❌ **No streaks, XP, habit scores, or leaderboards.**
- ❌ **No shame for missed days or rigid check-ins.**
- ✅ **A peaceful, practical daily checklist** designed around real-life rhythms and changing schedules.

---

## 📱 App Showcase

<p align="center">
  <img src="screenshot image/showcase_01_today_flow.jpg" width="23%" alt="Today Flow" />
  <img src="screenshot image/showcase_02_routines_library.jpg" width="23%" alt="Routines Library" />
  <img src="screenshot image/showcase_03_weekly_schedule.jpg" width="23%" alt="Weekly Schedule" />
  <img src="screenshot image/showcase_04_lifestyle_blueprints.jpg" width="23%" alt="Lifestyle Blueprints" />
</p>

---

## ✨ Core Features

### 1. 🌅 Four Chronological Daily Blocks
- **Morning (6:00 AM – 12:00 PM)**
- **Afternoon (12:00 PM – 5:00 PM)**
- **Evening (5:00 PM – 9:30 PM)**
- **Bedtime (9:30 PM – Sleep)**

### 2. 🏛️ Lifestyle Blueprints
Choose a lifestyle blueprint upon onboarding or switch anytime via Settings:
- **🏛️ Govt Exam Aspirant (100% Full-Time Self-Study)**: High-yield syllabus coverage, newspaper analysis, GS slots, CSAT, optional revision, and timed mock tests.
- **💼 Corporate Worker & Professional**: Commute prep, WFH deep work focus, cross-functional syncs, post-work gym, and executive wind-downs.
- **🎓 College & School Student**: Lecture prep, lab sessions, assignment sprints, library research, and student rest.
- **✨ General Lifestyle**: Mindful fresh start, midday flow, evening relaxation, and healthy sleep reset.

> **Blueprint Isolation**: Selecting a blueprint activates only its curated templates. Custom templates created while using a blueprint remain safely preserved under that persona profile.

### 3. 🔄 Independent Block Swapping & One-Off Tasks
- Swap any block for today only with another template, mark it as **Off / Free**, or customize it without altering weekly defaults.
- Add one-off tasks with target time pills and notes directly to today's schedule.

### 4. 📅 Recurring Weekly Schedule
- Map default templates for each day of the week (Monday through Sunday).
- **"Copy to Mon–Fri"** action for quick weekday configuration.

### 5. 🔒 100% Local & Private
- All schedules, templates, and history are stored securely on-device using local persistence.
- Zero server tracking, telemetry, or account requirements.
- Full JSON backup export and restore capabilities.

### 6. 🎨 Theme System
- Native support for **Light Mode**, **Dark Mode**, and **System Auto-detection**.

---

## 📸 Screenshots (Physical Device)

| Screen | Description | Clean Capture |
| :--- | :--- | :---: |
| **Today's Flow** | Daily routine checklist with calm progress bar | [View Screenshot](screenshot%20image/01_today_flow.png) |
| **Routines Library** | Morning, Afternoon, Evening & Bedtime templates | [View Screenshot](screenshot%20image/02_routines_library.png) |
| **Weekly Schedule** | Recurring 7-day timetable planner | [View Screenshot](screenshot%20image/03_weekly_schedule.png) |
| **Lifestyle Blueprints** | Theme selector & lifestyle profiles | [View Screenshot](screenshot%20image/04_lifestyle_blueprints.png) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/ravishu5/DayCraft.git
cd DayCraft

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

### Android Native Build (Capacitor)
```bash
# Build production web bundle
npm run build

# Sync assets to Android project
npx cap sync android

# Build release APK
cd android
./gradlew assembleRelease
```

The signed release APK will be generated at:
```text
DayCraft-release.apk
```

---

## 🛠️ Tech Stack
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Native Mobile**: [Capacitor 7](https://capacitorjs.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS Design Tokens & Glassmorphism

---

## 📄 License
This project is licensed under the MIT License.
