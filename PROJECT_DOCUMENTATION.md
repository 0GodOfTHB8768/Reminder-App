# Game Day Tracker - Complete Project Documentation

## Project Overview

**Game Day Tracker** is an NFL-themed task/reminder management Progressive Web App (PWA) built for Gurshaan. The app gamifies productivity by turning tasks into "plays" and completing them into "touchdowns," making deadline management engaging and fun.

### Tech Stack
- **Frontend**: React 19.2 + TypeScript
- **Styling**: Tailwind CSS 4.1
- **Animations**: Framer Motion 12.27
- **Backend/Auth**: Firebase (Firestore + Authentication)
- **OCR**: Google Cloud Vision API + Tesseract.js
- **Build Tool**: Vite 7.2
- **Date Handling**: date-fns 4.1

---

## Features Built

### 1. Core Reminder/Task System

#### Data Model (`src/lib/types.ts`)
```typescript
interface Reminder {
  id: string;
  title: string;
  description?: string;
  deadline: string;           // ISO date string
  priority: Priority;         // 'hail-mary' | 'red-zone' | 'first-down' | 'practice'
  category: Category;         // 'work' | 'school' | 'personal' | 'health' | 'other'
  isCompleted: boolean;
  completedAt?: string;
  completionStatus?: CompletionStatus;  // 'touchdown' | 'field-goal' | 'turnover'
  notifyBefore?: number;      // Minutes before deadline
  createdAt: string;
}
```

#### Priority System (NFL-Themed)
| Priority | Label | Description |
|----------|-------|-------------|
| `hail-mary` | Hail Mary | Critical - Must complete! (Red) |
| `red-zone` | Red Zone | High priority (Orange) |
| `first-down` | First Down | Normal priority (Blue) |
| `practice` | Practice | Low priority (Gray) |

#### Completion Status
- **Touchdown**: Completed on time
- **Field Goal**: Completed late
- **Turnover**: Missed deadline (auto-marked)

---

### 2. Firebase Integration

#### Authentication (`src/contexts/AuthContext.tsx`)
- Google Sign-In (OAuth popup)
- Email/Password authentication
- User profile with custom "Player Name"
- Onboarding flow for new users

#### Firestore Database (`src/contexts/ReminderContext.tsx`)
- Real-time sync with `onSnapshot` listeners
- Automatic local-to-cloud migration on first login
- Offline fallback to localStorage
- Collections:
  - `users/{uid}` - User profile
  - `users/{uid}/reminders/{id}` - User's reminders

#### Setup (`src/lib/firebase.ts`)
```typescript
// Environment variables required:
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

---

### 3. NFL Team Themes (`src/lib/themes.ts`)

All 32 NFL teams with authentic colors:

#### AFC Teams
| Division | Teams |
|----------|-------|
| East | Bills, Dolphins, Patriots, Jets |
| North | Ravens, Bengals, Browns, Steelers |
| South | Texans, Colts, Jaguars, Titans |
| West | Broncos, Chiefs, Raiders, Chargers |

#### NFC Teams
| Division | Teams |
|----------|-------|
| East | Cowboys, Giants, Eagles, Commanders |
| North | Bears, Lions, Packers, Vikings |
| South | Falcons, Panthers, Saints, Buccaneers |
| West | Cardinals, Rams, 49ers, Seahawks |

#### Theme Structure
```typescript
interface NFLTheme {
  id: string;           // e.g., 'packers'
  name: string;         // e.g., 'Packers'
  city: string;         // e.g., 'Green Bay'
  primary: string;      // Main color hex
  secondary: string;    // Accent color hex
  primaryRgb: string;   // RGB for gradients
  secondaryRgb: string;
  conference: 'AFC' | 'NFC';
  division: 'North' | 'South' | 'East' | 'West';
}
```

#### Theme Application (`src/contexts/ThemeContext.tsx`)
- CSS custom properties for dynamic theming
- Persisted to localStorage and Firestore
- Applied to navigation, buttons, gradients

---

### 4. OCR Bracelet Scanner (`src/components/scan/`)

#### Purpose
Scan handwritten notes on a physical bracelet and convert them into reminders.

#### Implementation
1. **Image Capture**: Camera or file upload
2. **Processing**: Google Cloud Vision API (DOCUMENT_TEXT_DETECTION)
3. **Preview**: Edit extracted text before saving
4. **Create Reminder**: Parse and save as new reminder

#### Files
- `BraceletScanner.tsx` - Main scanner component
- `ScanPreview.tsx` - Review/edit extracted text

#### API Setup
```typescript
VITE_GOOGLE_CLOUD_VISION_API_KEY=your_api_key
```

---

### 5. Calendar View (`src/components/calendar/`)

#### Features
- Monthly grid view
- Navigate between months
- Color-coded reminder indicators by priority
- Click day to see reminders
- Quick complete/edit actions

#### Components
- `Calendar.tsx` - Main calendar grid
- `CalendarDay.tsx` - Individual day cell
- `DayDetail.tsx` - Modal showing day's reminders

---

### 6. Dashboard (`src/components/dashboard/`)

#### Components
- `Dashboard.tsx` - Main dashboard with upcoming reminders
- `Scoreboard.tsx` - Stats display
- `GameDayCard.tsx` - Individual reminder card with:
  - Live countdown timer
  - Urgency-based styling
  - Swipe gestures (complete/delete)
  - Priority and category badges

---

### 7. Season Stats (`src/components/completed/`)

#### Stats Tracked
```typescript
interface Stats {
  touchdowns: number;      // Completed on time
  fieldGoals: number;      // Completed late
  turnovers: number;       // Missed deadlines
  currentStreak: number;   // Consecutive touchdowns
  bestStreak: number;
  totalPlays: number;
}
```

#### Features
- Win rate percentage
- Best streak display
- Filter by completion type
- History list with TouchdownCard components

---

### 8. Playbook View (`src/components/reminders/`)

#### Components
- `ReminderList.tsx` - All reminders list
- `ReminderItem.tsx` - Individual item with swipe gestures
- `ReminderForm.tsx` - Create/edit form

---

### 9. Mobile UX Improvements

#### Swipe Gestures (`GameDayCard.tsx`, `ReminderItem.tsx`)
- **Swipe Right**: Complete reminder (green checkmark)
- **Swipe Left**: Delete reminder (red trash icon)
- Visual feedback with color gradients during swipe
- Uses Framer Motion's `useMotionValue` and `useTransform`

#### Navigation (`src/components/layout/Navigation.tsx`)
- **Mobile**: Bottom navigation bar with centered Add button
- **Desktop**: Left sidebar with all nav items at top
- Responsive breakpoints using Tailwind's `md:` prefix

#### Layout Adjustments (`src/components/layout/`)
- Increased bottom padding (`pb-32`) to prevent nav overlap
- Compact header on mobile (hidden quote, smaller text)
- Safe area handling for notched devices

---

### 10. Countdown Timer Hook (`src/hooks/useCountdown.ts`)

#### Urgency Levels
| Level | Threshold | Color |
|-------|-----------|-------|
| Critical | < 1 hour | Red, pulsing |
| Urgent | < 3 hours | Orange |
| Soon | < 24 hours | Yellow |
| Upcoming | < 3 days | Green |
| Normal | > 3 days | Gray |
| Overdue | Past deadline | Red |

#### Features
- Real-time countdown (updates every second)
- Dynamic urgency styling
- Formatted display text

---

### 11. Notifications (`src/hooks/useNotifications.ts`)

- Browser notification permission request
- Scheduled notifications based on `notifyBefore` setting
- Native notification API integration

---

### 12. Celebrations (`src/components/common/Celebration.tsx`)

- Confetti animation on touchdown
- Different effects for field goals
- Framer Motion animations

---

### 13. Intro Tour (`src/components/common/IntroTour.tsx`)

- First-time user walkthrough
- Feature highlights
- Completion tracking via `useIntroTour` hook

---

## Project Structure

```
src/
├── App.tsx                    # Main app component
├── main.tsx                   # Entry point
├── index.css                  # Global styles
├── vite-env.d.ts
│
├── components/
│   ├── auth/
│   │   ├── AuthModal.tsx      # Sign in/up modal
│   │   ├── OnboardingModal.tsx # New user setup
│   │   ├── SettingsModal.tsx  # User settings
│   │   ├── UserMenu.tsx       # Profile dropdown
│   │   └── index.ts
│   │
│   ├── calendar/
│   │   ├── Calendar.tsx       # Monthly calendar
│   │   ├── CalendarDay.tsx    # Day cell
│   │   ├── DayDetail.tsx      # Day modal
│   │   └── index.ts
│   │
│   ├── common/
│   │   ├── Card.tsx           # Reusable card
│   │   ├── Celebration.tsx    # Confetti effects
│   │   ├── IntroTour.tsx      # Onboarding tour
│   │   ├── Modal.tsx          # Modal component
│   │   └── index.ts
│   │
│   ├── completed/
│   │   ├── CompletedList.tsx  # Season stats view
│   │   ├── TouchdownCard.tsx  # Completed item card
│   │   └── index.ts
│   │
│   ├── dashboard/
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── GameDayCard.tsx    # Reminder card
│   │   ├── Scoreboard.tsx     # Stats display
│   │   └── index.ts
│   │
│   ├── layout/
│   │   ├── Header.tsx         # App header
│   │   ├── Layout.tsx         # Page layout
│   │   ├── Navigation.tsx     # Nav bar/sidebar
│   │   └── index.ts
│   │
│   ├── reminders/
│   │   ├── ReminderForm.tsx   # Create/edit form
│   │   ├── ReminderItem.tsx   # List item
│   │   ├── ReminderList.tsx   # Playbook view
│   │   └── index.ts
│   │
│   └── scan/
│       ├── BraceletScanner.tsx # OCR scanner
│       ├── ScanPreview.tsx    # Review scanned text
│       └── index.ts
│
├── contexts/
│   ├── AuthContext.tsx        # Auth state management
│   ├── ReminderContext.tsx    # Reminders state
│   └── ThemeContext.tsx       # Theme management
│
├── hooks/
│   ├── useCountdown.ts        # Countdown timer
│   └── useNotifications.ts    # Browser notifications
│
└── lib/
    ├── constants.ts           # App constants
    ├── firebase.ts            # Firebase setup
    ├── storage.ts             # localStorage helpers
    ├── themes.ts              # NFL team themes
    └── types.ts               # TypeScript types
```

---

## Key Implementation Details

### 1. Lazy Loading
Components are lazy-loaded for performance:
```typescript
const Calendar = lazy(() => import('./components/calendar'));
const BraceletScanner = lazy(() => import('./components/scan'));
```

### 2. State Management
- React Context for global state (Auth, Reminders, Theme)
- Local state for UI components
- Firebase real-time listeners for sync

### 3. Responsive Design
- Mobile-first approach
- Tailwind breakpoints: `sm:`, `md:`, `lg:`
- Safe area padding for notched devices

### 4. Animation Philosophy
- Framer Motion for all animations
- Subtle micro-interactions
- Performance-optimized with `AnimatePresence`

---

## Environment Variables

Create a `.env` file with:
```
# Firebase
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx

# Google Cloud Vision (for OCR)
VITE_GOOGLE_CLOUD_VISION_API_KEY=xxx
```

---

## Running the Project

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## Design Decisions

1. **NFL Theme**: Gamification makes productivity fun
2. **Real-time Sync**: Firebase enables cross-device access
3. **Offline Support**: localStorage fallback ensures availability
4. **PWA**: Installable on mobile devices
5. **Swipe Gestures**: Mobile-native feel for quick actions
6. **Team Themes**: Personalization increases engagement

---

## Future Enhancements (Ideas)

- Push notifications via Firebase Cloud Messaging
- Recurring reminders
- Team/shared reminders
- Widgets for mobile home screen
- Apple Watch companion app
- Siri/Google Assistant integration

---

*Built with React, TypeScript, Firebase, and Framer Motion*
*Designed for Gurshaan by Siddharth Gumballi*
