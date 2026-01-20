# Game Day Tracker

A football-themed deadline and reminder tracker app with Green Bay Packers styling. Turn your tasks into plays and score touchdowns by completing them on time!

![Green Bay Packers Colors](https://img.shields.io/badge/theme-Packers-203731?style=flat&labelColor=FFB612)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)

## Features

### Task Management
- **Create Reminders** - Add tasks with deadlines, priorities, and categories
- **Priority Levels** - Hail Mary (critical), Red Zone (high), First Down (normal), Practice (low)
- **Categories** - Work, School, Personal, Health, Other
- **Live Countdown** - Real-time countdown timers for each task

### Calendar View
- **Monthly Grid** - Navigate between months to see your schedule
- **Visual Indicators** - Color-coded dots show task priorities at a glance
- **Day Details** - Click any day to see and manage that day's tasks
- **Quick Actions** - Complete or edit tasks directly from the calendar

### Scoring System
- **Touchdown (7 pts)** - Complete a task before the deadline
- **Field Goal (3 pts)** - Complete a task after the deadline
- **Turnover (0 pts)** - Miss a deadline completely
- **Win Streak** - Track consecutive on-time completions

### Additional Features
- **Dashboard** - Overview of upcoming tasks and stats
- **Scoreboard** - Track your touchdowns, field goals, and win rate
- **Notifications** - Browser notifications for upcoming deadlines
- **Dark Theme** - Easy on the eyes with Packers green and gold
- **PWA Support** - Install as an app on your device
- **Local Storage** - Your data stays on your device

## Screenshots

The app features a dark theme with Green Bay Packers colors:
- **Primary Green:** #203731
- **Gold:** #FFB612

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/siddharthgumballi/Reminder-App.git
cd Reminder-App

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **date-fns** - Date manipulation
- **PWA** - Progressive Web App support

## Project Structure

```
src/
├── components/
│   ├── calendar/      # Calendar view components
│   ├── common/        # Shared UI components (Button, Modal, etc.)
│   ├── completed/     # Completed tasks view
│   ├── dashboard/     # Dashboard and game day cards
│   ├── layout/        # Header, Navigation, Layout
│   └── reminders/     # Reminder form and list
├── contexts/          # React Context for state management
├── hooks/             # Custom hooks (countdown, notifications)
├── lib/               # Types, constants, utilities
└── App.tsx            # Main application component
```

## License

MIT
