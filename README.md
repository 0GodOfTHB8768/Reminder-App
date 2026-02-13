# Game Day Tracker

**An NFL-themed deadline tracker that turns productivity into a game.**

Score touchdowns by beating your deadlines, rack up field goals for late completions, and avoid turnovers when you miss them entirely. Built with React, TypeScript, and Firebase.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12-DD2C00?logo=firebase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?logo=pwa&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Background

Game Day Tracker was designed and developed by **Siddharth Gumballi** for a real client, **Gurshaan Malhans**, following the Design Thinking process.

The process started with empathy interviews to understand Gurshaan's struggles with managing deadlines and reminders. Through the Define phase, the team synthesized interview notes and empathy mapping into a clear problem statement. During Ideation, solutions were brainstormed across four categories -- Rational Choice, Likely to Delight, Darling, and Longshot -- to explore a wide range of possibilities.

One of the physical prototypes was a cardboard wristband for writing and erasing reminders. Gurshaan's feedback was that it was convenient, portable, and reduced phone dependency, but had durability issues. This prototype directly inspired the app's **OCR Bracelet Scanner** feature, which lets users photograph handwritten notes on a physical bracelet and convert them into digital reminders using Google Cloud Vision.

The full design process is documented on the [design blog](https://siddharthg125.wixsite.com/designblog).

---

## Features

### Scoring System

The core mechanic turns every deadline into a play:

| Result | Points | When |
|--------|--------|------|
| **Touchdown** | 7 pts | Completed before the deadline |
| **Field Goal** | 3 pts | Completed after the deadline |
| **Turnover** | 0 pts | Deadline missed entirely |

Track your **win rate**, **current streak**, and **best streak** on the scoreboard.

### Task Management

- **NFL-themed priorities** -- Hail Mary (critical), Red Zone (high), First Down (normal), Practice (low)
- **Categories** -- Work, School, Personal, Health, Other
- **Live countdown timers** with urgency-based color coding
- **Calendar view** with color-coded priority indicators per day
- **Swipe gestures** -- swipe right to complete, left to delete (mobile)

### Authentication & Cloud Sync

- Google Sign-In and email/password authentication
- Real-time Firestore sync across devices
- Automatic migration of local data to cloud on first login
- Offline fallback to localStorage when signed out

### 32 NFL Team Themes

Every NFL team is available as a color theme -- pick your team's colors for the entire UI. Themes persist across sessions and sync to the cloud.

### Progressive Web App

Installable on mobile and desktop. Includes a service worker for offline caching and native-feeling navigation.

---

## The Bracelet: From Physical Prototype to Digital Feature

The bracelet is central to how Game Day Tracker came to be.

### The Origin

During the prototyping phase, the team built a physical wristband out of cardboard -- a surface you could write reminders on with a marker and erase when done. When tested with Gurshaan, he liked that it was always on his wrist (no pulling out a phone), worked in settings where phones are restricted, and let him jot down ideas the moment they came up. The problem was durability: cardboard wears out, erasing is imperfect, and space is limited.

The final product keeps what worked about the bracelet -- the immediacy of writing things down by hand -- and solves what didn't by digitizing the notes automatically.

### How the Bracelet Scanner Works

The scanner bridges the physical bracelet and the digital app in four steps:

1. **Capture** -- Open the scanner in the app and either take a photo with your camera or upload an existing image of your handwritten bracelet notes. The app is optimized for mobile, so the camera option launches directly into the device's rear camera.

2. **OCR Processing** -- The image is sent to Google Cloud Vision's `DOCUMENT_TEXT_DETECTION` API, which is specifically tuned for handwriting recognition. It returns the raw extracted text.

3. **Smart Parsing** -- The app's parser (`ScanPreview.tsx`) analyzes the extracted text line by line, looking for:
   - **Dates** in multiple formats (`January 22nd 2026`, `01/22/2026`, `2026-01-22`)
   - **Times** in 12-hour (`7:30 PM`) or 24-hour (`19:30`) format
   - **Priority keywords** like "Hail Mary", "Red Zone", "First Down", or "Practice"
   - Everything else becomes the **title** and **description**

4. **Review & Save** -- The parsed result is shown in an editable form alongside the original photo. You can adjust the title, deadline, priority, and category before saving it as a reminder. If the OCR missed something, you can correct it manually.

### Tips for Best Results

- Use **dark ink** and **print letters** on the bracelet
- Photograph in **bright, even lighting** with no shadows
- **Fill the frame** -- get close so the text is large and in focus

The scanner component is lazy-loaded so it doesn't affect initial bundle size for users who don't use this feature.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/siddharthgumballi/Reminder-App.git
cd Reminder-App
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Firebase (required for auth and cloud sync)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Google Cloud Vision (required for bracelet scanner)
VITE_GOOGLE_CLOUD_VISION_API_KEY=
```

> The app works without Firebase -- it falls back to localStorage for all data. The bracelet scanner requires a Vision API key.

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview   # preview the build locally
```

### Linting

```bash
npm run lint
```

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [React 19](https://react.dev) | UI framework |
| [TypeScript 5.9](https://www.typescriptlang.org) | Type safety |
| [Vite 7](https://vite.dev) | Build tool and dev server |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first styling |
| [Firebase 12](https://firebase.google.com) | Authentication and Firestore database |
| [Framer Motion 12](https://motion.dev) | Animations and gestures |
| [date-fns 4](https://date-fns.org) | Date manipulation |
| [Google Cloud Vision](https://cloud.google.com/vision) | OCR for bracelet scanner |
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app) | PWA and service worker |

---

## Project Structure

```
src/
├── components/
│   ├── auth/           # Login, onboarding, settings, user menu
│   ├── calendar/       # Monthly calendar grid and day detail modal
│   ├── common/         # Shared UI (Button, Card, Modal, Celebration, IntroTour)
│   ├── completed/      # Season stats and completion history
│   ├── dashboard/      # Main view with upcoming reminders and scoreboard
│   ├── layout/         # Header, responsive navigation, page layout
│   ├── reminders/      # Playbook view with create/edit form
│   └── scan/           # OCR bracelet scanner and preview
├── contexts/           # React Context providers (Auth, Reminders, Theme)
├── hooks/              # useCountdown, useNotifications, useIntroTour
├── lib/                # Types, constants, Firebase config, themes, storage
└── App.tsx             # Root component with routing and lazy loading
```

---

## Design Process

This project followed the five stages of Design Thinking:

1. **Empathize** -- Conducted interviews with Gurshaan using empathy mapping to understand his needs, frustrations, and habits around deadline management.
2. **Define** -- Synthesized research into a focused problem statement about needing a more engaging and accessible way to track deadlines.
3. **Ideate** -- Brainstormed solutions across Rational Choice, Likely to Delight, Darling, and Longshot categories.
4. **Prototype** -- Built three prototypes including a physical cardboard wristband for writing reminders.
5. **Test** -- Gathered feedback from Gurshaan. The wristband was praised for portability and reducing phone usage, but flagged for durability. These insights shaped the final digital product.

Read the full process: [Design Blog](https://siddharthg125.wixsite.com/designblog)

---

## Author

**Siddharth Gumballi** -- Design and development

Built for **Gurshaan Malhans**.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
