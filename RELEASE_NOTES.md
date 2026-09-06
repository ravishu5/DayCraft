# 🌿 DayCraft v1.0.0 — Calm Daily Routine & Timetable Planner

Welcome to the initial release of **DayCraft**! 🎉

DayCraft is a mobile-first, intentional daily routine composer designed around real-life human rhythms.

> **Users build their day by combining different routine types for Morning (🌅), Afternoon (☀️), Evening (🌆), and Bedtime (🌙).**
>
> Explicitly **not a habit tracker** — no streaks, XP, habit scores, leaderboards, or gamification. A peaceful, practical daily checklist tailored to the kind of day you are living.

---

## 📦 Downloads & Installation

| Asset | Size | Target Platform | Description |
| :--- | :--- | :--- | :--- |
| **[`DayCraft-release.apk`](https://github.com/ravishu5/DayCraft/releases/download/v1.0.0/DayCraft-release.apk)** | ~22 MB | Android 7.0+ (API 24–36) | Production-signed release APK with full offline support |

### How to Install on Android
1. Download **`DayCraft-release.apk`** to your Android device.
2. Tap the downloaded file in your notification drawer or Downloads folder.
3. If prompted, allow installation from your browser/file manager (*Settings → Install unknown apps*).
4. Tap **Install** and open **DayCraft**!

---

## ✨ What's Included in v1.0.0

### 1. 🏛️ Four Curated Lifestyle Blueprints
Select your blueprint on first launch or switch anytime via Settings:
- **🏛️ Govt Exam Aspirant (100% Full-Time Self-Study)**: Tailored for UPSC, SSC, Banking, and State PSC candidates. Morning editorial study, GS slot 1, CSAT slot 2, timed mocks, and daily study audit.
- **💼 Corporate Worker & Professional**: Built for office commutes, WFH focus, cross-functional syncs, post-work gym, and executive wind-downs.
- **🎓 College & School Student**: Campus lectures, lab sessions, assignment sprints, library research, and student rest.
- **✨ General Lifestyle**: Mindful fresh start, midday flow, evening relaxation, and healthy sleep reset.

> **Blueprint Isolation**: Templates created or customized while using a blueprint remain isolated to that profile.

### 2. 🌅 Chronological Day Composition
- **Morning (6:00 AM – 12:00 PM)**
- **Afternoon (12:00 PM – 5:00 PM)**
- **Evening (5:00 PM – 9:30 PM)**
- **Bedtime (9:30 PM – Sleep)**
- **Calm Progress**: Non-judgmental completion bar (*e.g., 8 of 14 completed*).
- **Independent Block Swapping**: Tap "Change" on any block to swap templates, customize for today, or mark as *Off / Free*.
- **One-Off Tasks**: Add custom tasks with target times and notes directly to today's schedule without altering your reusable templates.

### 3. 📅 Recurring Weekly Schedule Planner
- Set default templates for every day of the week (Monday through Sunday).
- **"Copy to Mon–Fri"** quick shortcut to set up your entire work/study week in one tap.

### 4. ⚙️ Remote Minimum Version Governance
- Real-time version check via `version-config.json` with cache-busting.
- Graceful in-app prompts for updates with direct download link.
- In-app "Check for Updates" trigger in Settings.

### 5. 🔒 100% Offline & Private
- All schedules, templates, and history are stored securely on-device using local persistence.
- Zero tracking, telemetry, or server dependency.

### 6. 🎨 Dual Theme System
- Native support for **Light Mode**, **Dark Mode (Calm Obsidian)**, and **System Auto-detection**.

---

## 🛠️ Verification & Build Details
- **Package ID**: `com.daycraft.routineplanner`
- **Version**: `1.0.0` (versionCode `1`)
- **Signature**: Android APK Signature Scheme v2 (Signed with release keystore)
- **Framework**: React 19 + TypeScript 5.9 + Vite 7 + Capacitor 7
