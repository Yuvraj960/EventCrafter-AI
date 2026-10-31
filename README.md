# 🎊 EventCraft AI

> **Autonomous GenAI Event Planning Assistant powered by Google Gemini 2.5 Flash.**  
> Transform dream weddings, milestone birthdays, and community festivals into actionable, interactive blueprints in seconds — not spreadsheets.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google Gen AI SDK](https://img.shields.io/badge/Google%20Gen%20AI-Gemini%202.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Interactive Workspace Walkthrough](#-interactive-workspace-walkthrough)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Data Models & Schema](#-data-models--schema)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Demo Mode & Graceful Degradation](#-demo-mode--graceful-degradation)
- [Project Directory Structure](#-project-directory-structure)
- [Launch Video & Media](#-launch-video--media)
- [License](#-license)

---

## 🌟 Overview

Organizing a milestone event usually means juggling 14 disconnected spreadsheets, chaotic vendor quote emails, and generic Pinterest boards. 

**EventCraft AI** replaces the spreadsheet sprawl with an autonomous, local-first intelligence platform. Using Google's official `@google/genai` SDK and the **Gemini 2.5 Flash** model with strict JSON schema enforcement, EventCraft AI generates a production-ready event blueprint in **~4 seconds**:
- **Mathematically balanced category budgets** mapped to guest capacity and location.
- **Chronological milestone timelines** spanning months before through event-day execution.
- **Curated vendor sourcing checklists** complete with AI-generated interview questionnaires.
- **Bespoke aesthetic ideas** backed by practical "💡 DIY Budget Hacks".
- **An in-app AI Co-Pilot** injected with live event state for instant plan adjustments and vendor email drafting.

---

## ⚡ Key Features

### 1. 3-Step Smart Intake Wizard
- **Event Types:** Dedicated visual workflows for **Weddings**, **Birthdays**, and **Community Galas**.
- **Multi-Currency Engine:** First-class support for **₹ INR**, **$ USD**, **€ EUR**, and **£ GBP** with instant scaling.
- **Adaptive Guest & Budget Selectors:** Interactive guest slider with one-tap presets (25, 50, 100, 150, 250, 400).
- **Vibe & Aesthetic Tags:** Pre-configured cultural and aesthetic tags (*Rustic Romance, Neon Disco, Eco-Friendly, Cultural Heritage, Cyberpunk Arcade*), plus custom nuance fields.
- **Multi-Stage Animated Loading:** Cycles through real synthesis stages while Gemini crafts the blueprint.

### 2. Dynamic Event Theming
Visual palettes and accents automatically adapt based on event category:
- **Weddings:** Rose & Champagne Gold palette (`rose-600`, `amber-50`, refined styling).
- **Birthdays:** Vibrant Violet & Coral palette (`violet-600`, `fuchsia-50`, energetic accents).
- **Community Events:** Emerald & Teal palette (`emerald-600`, `teal-50`, collaborative feel).

### 3. Interactive Event Workspace (`/events/[id]`)
Generated plans are never static Markdown walls — they are living, interactive workspaces:
- **Dynamic Header:** Real-time event countdown timer (`"145 days to go"`), headcount badge, and an automated **0–100% Readiness Score Meter** calculated across completed tasks, booked vendors, and budget allocations.
- **Budget Tracker Tab:** 
  - 4 KPI summary cards (*Total Budget, Estimated Spend, Actual Spend, Remaining Balance* with red over-budget warnings).
  - Horizontal stacked percentage distribution bar.
  - Live inline editing of both `estimatedCost` and `actualCost`.
  - Add & delete custom line items with automatic percentage rebalancing.
- **Timeline & Milestones Tab:**
  - Grouped chronologically (*3 Months Before*, *1 Month Before*, *Week Of*, *Event Day*).
  - Overall completion progress bar.
  - Interactive completion checkboxes that dynamically update the event readiness meter.
  - Filter pills (`All`, `Pending`, `Completed`, `High Priority`) and custom milestone creation.
- **Vendor Checklist Tab:**
  - Status progression cards (`Researching` ➔ `Contacted` ➔ `Quoted` ➔ `Booked`).
  - Expandable **"Questions to Ask Before Booking"** accordion for contract protection.
  - Add custom vendors with specific budget limits.
- **Personalized Ideas Studio Tab:**
  - Masonry grid categorized into *Theme*, *Food & Drink*, *Activity*, and *Memorable Touch*.
  - Highlighted **"💡 DIY Budget Hack"** callout boxes for high-impact cost savings.
  - One-click idea bookmarking and filter controls.

### 4. Slide-Over AI Event Co-Pilot
An on-demand drawer (`/api/copilot`) that passes the current event state directly into Gemini 2.5 Flash:
- **Pre-Engineered Quick Actions:**
  - *"Optimize my budget to save 15%"* ➔ Returns concrete tradeoffs and line-item cut recommendations.
  - *"Draft an inquiry email to a [Vendor Type] for my event"* ➔ Pre-fills event parameters into a professional email ready to copy.
  - *"Generate a Day-Of hour-by-hour run sheet"* ➔ Creates a minute-by-minute schedule from load-in to departure.
- **One-Click Copy to Clipboard:** Easily export generated emails or schedules.

### 5. Local-First Storage with Supabase Cloud Sync
- **Zero-Latency Offline First:** All changes immediately persist to `localStorage` via an atomic storage adapter.
- **Background Cloud Synchronization:** Automatically upserts changes to Supabase (`public.events`) when credentials are provided.
- **Conflict-Free Merge:** Merges cloud and local states on application mount using timestamp resolution.

### 6. Executive Export & Print Engine
- Dedicated **Export / Print** action in the workspace header.
- Custom `@media print` stylesheet automatically hides navigation chrome, buttons, and tab controls to format a clean, publication-grade executive summary for physical printing or PDF saving.

---

## 🛠 Architecture & Tech Stack

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Next.js 16 + React 19)"]
        Landing["Landing Page (src/app/page.tsx)"]
        Wizard["3-Step Intake Wizard (CreateEventWizard.tsx)"]
        Workspace["Interactive Workspace (/events/[id])"]
        CopilotUI["AI Co-Pilot Drawer (AICopilotDrawer.tsx)"]
    end

    subgraph Adapters ["Data & Storage Layer"]
        StorageAdapter["Storage Adapter (src/lib/storage.ts)"]
        LocalStore[("Browser LocalStorage")]
        SupabaseClient["Supabase Client (src/lib/supabase.ts)"]
    end

    subgraph Backend ["Next.js Server API Routes"]
        GenRoute["/api/generate-plan (route.ts)"]
        CopilotRoute["/api/copilot (route.ts)"]
    end

    subgraph Cloud ["External Cloud Services"]
        Gemini["Google Gemini 2.5 Flash (@google/genai)"]
        SupabaseDB[("Supabase PostgreSQL (JSONB)")]
    end

    Landing --> Wizard
    Wizard -->|POST intake data| GenRoute
    GenRoute -->|responseSchema JSON| Gemini
    GenRoute -->|Structured EventPlan| Wizard
    Wizard -->|saveEvent()| StorageAdapter

    Workspace <-->|Read / Write| StorageAdapter
    CopilotUI -->|POST live context| CopilotRoute
    CopilotRoute -->|Contextual Prompting| Gemini

    StorageAdapter -->|Synchronous| LocalStore
    StorageAdapter -.->|Async Background Sync| SupabaseClient
    SupabaseClient -.-> SupabaseDB
```

### Core Technologies

| Technology | Purpose |
|---|---|
| **Next.js 16 (App Router)** | Framework with Server-Side API Handlers and client components |
| **React 19** | Component architecture and state management |
| **TypeScript 5.9** | Strict end-to-end data typing across all interfaces |
| **Tailwind CSS v4** | Modern utility-first styling with inline design token variables |
| **`@google/genai`** | Official Google Gen AI SDK for Gemini 2.5 Flash integration |
| **`@supabase/supabase-js`** | Hybrid cloud persistence and data sync |
| **`lucide-react`** | Crisp iconography for metrics, event types, and tabs |

---

## 📊 Data Models & Schema

All core types are strictly modeled in [`src/types/event.ts`](src/types/event.ts):

```typescript
export interface EventPlan {
  id: string;
  userId?: string | null;
  eventType: 'wedding' | 'birthday' | 'community';
  eventName: string;
  date: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: '₹' | '$' | '€' | '£' | string;
  vibe: string;
  specialRequests?: string;
  summary: string;
  budgetBreakdown: BudgetItem[];
  timeline: TimelineItem[];
  vendorChecklist: VendorItem[];
  personalizedIdeas: IdeaItem[];
  createdAt: string;
  updatedAt: string;
}
```

### Supabase Table (`public.events`)
Nested arrays (`budget_breakdown`, `timeline`, `vendor_checklist`, `personalized_ideas`) are stored as `jsonb` columns for zero-join real-time state manipulation:

```sql
create table public.events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade null,
  event_type text not null,
  event_name text not null,
  event_date date,
  location text,
  guest_count integer default 50,
  total_budget numeric default 5000,
  currency text default '$',
  vibe text,
  summary text,
  budget_breakdown jsonb default '[]'::jsonb,
  timeline jsonb default '[]'::jsonb,
  vendor_checklist jsonb default '[]'::jsonb,
  personalized_ideas jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.18.0` or later (tested on Node.js 20 & 24)
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### 1. Clone & Install

```bash
git clone https://github.com/your-username/eventcraft-ai.git
cd eventcraft-ai
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Populate the keys:

```env
# Google AI Studio API Key (for Gemini 2.5 Flash)
GEMINI_API_KEY="your_google_ai_studio_api_key"

# Supabase Configuration (Optional - LocalStorage used if omitted)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Recommended | Google AI Studio API key used to call `gemini-2.5-flash` for blueprints and co-pilot. |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase project URL for cloud database persistence. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Supabase public anonymous key for Row-Level Security client operations. |

---

## 🛡️ Demo Mode & Graceful Degradation

EventCraft AI is built to be **100% testable out of the box**:
- **No Gemini API Key?** If `GEMINI_API_KEY` is not detected, the app automatically switches to **Demo Mode**, using high-fidelity algorithmic blueprints tailored to the selected event type so the UI remains interactive.
- **No Supabase Account?** The application seamlessly falls back to `localStorage` with zero user friction or configuration blockers.
- **Sample Blueprint Seeder:** On a fresh launch, the landing page includes a one-click button to load sample *Tuscan Vineyard Wedding* and *Retro Roller Disco Birthday* plans.

---

## 📂 Project Directory Structure

```text
eventcraft-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── copilot/          # Gemini 2.5 Flash conversational co-pilot API
│   │   │   └── generate-plan/    # Gemini 2.5 Flash structured JSON generator
│   │   ├── events/
│   │   │   └── [id]/             # Tabbed event management workspace
│   │   ├── globals.css           # Tailwind CSS v4 design tokens & print styles
│   │   ├── layout.tsx            # Root HTML layout and metadata
│   │   └── page.tsx              # High-converting landing page & blueprint vault
│   ├── components/
│   │   ├── event/
│   │   │   ├── AICopilotDrawer.tsx  # Slide-over AI Co-Pilot chat drawer
│   │   │   ├── BudgetTab.tsx        # KPI cards, distribution bar & inline editor
│   │   │   ├── EventHeader.tsx      # Countdown, readiness meter & export button
│   │   │   ├── IdeasTab.tsx         # Themed cards & DIY budget hacks
│   │   │   ├── TimelineTab.tsx      # Chronological checklists & priority tags
│   │   │   └── VendorsTab.tsx       # Vendor status cards & interview questions
│   │   ├── landing/
│   │   │   ├── EventTypeShowcase.tsx # Weddings / Birthdays / Community cards
│   │   │   └── FeatureGrid.tsx       # Core platform pillars
│   │   ├── wizard/
│   │   │   ├── constants.ts          # Curated theme tags & presets
│   │   │   ├── StepBasics.tsx        # Event type, name, date, location
│   │   │   ├── StepBudget.tsx        # Headcount slider & currency selector
│   │   │   ├── StepVibe.tsx          # Vibe chips & custom nuance inputs
│   │   │   └── WizardLoadingState.tsx# 3-stage animated progress display
│   │   ├── CreateEventWizard.tsx     # 3-step intake wizard controller
│   │   └── SavedEventsList.tsx       # Browser storage event card list
│   ├── lib/
│   │   ├── starterPlan.ts        # Algorithmic starter blueprint generator
│   │   ├── storage.ts            # Local-first + Supabase dual-sync adapter
│   │   └── supabase.ts           # Supabase client initialization & validation
│   └── types/
│       └── event.ts              # Strict TypeScript interfaces & schemas
├── brag-output/                  # Launch video (brag.mp4), poster (brag.jpg), brief
├── DECISIONS.MD                  # Architecture Decision Records (ADRs) & log
├── GEMINI.md                     # Project context, tech stack rules & SDK specs
├── AGENTS.md                     # Autonomous engineering loop instructions
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎬 Launch Video & Media

A full HD launch video (1920×1080 @ 30 fps) showcasing the entire product flow is bundled in the repository:
- **Video File:** [`brag-output/brag.mp4`](brag-output/brag.mp4)
- **High-Res Poster:** [`brag-output/brag.jpg`](brag-output/brag.jpg)
- **Creative Plan:** [`brag-output/brag-plan.md`](brag-output/brag-plan.md)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  <b>Built with ❤️ using Google Gemini 2.5 Flash and Next.js.</b><br>
  <i>Plan less. Celebrate more.</i>
</p>
