# DECISIONS.md - Architecture Decision Log & Project Status

## Architectural Decisions (ADRs)

### ADR-001: Structured JSON over Markdown Chat for Event Plans
- **Context:** Users need actionable budgets, timelines, and vendor checklists, not just a chat paragraph.
- **Decision:** We will use Gemini's `responseSchema` to return a single structured JSON payload containing `budgetBreakdown[]`, `timeline[]`, `vendorChecklist[]`, and `personalizedIdeas[]` when an event is created, plus an AI Co-Pilot chat drawer for iterative tweaks.

### ADR-002: Hybrid Storage Strategy (Supabase + LocalStorage Fallback)
- **Context:** During rapid prototyping and public demo evaluations, judges/users may test without signing up first.
- **Decision:** Build a clean storage adapter (`src/lib/storage.ts`) that syncs with Supabase when authenticated and seamlessly falls back to `localStorage` for guest users.
- **Implementation Status:** Configured via `src/lib/supabase.ts` and `src/lib/storage.ts`. Whenever `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are provided, event additions, updates, and removals are asynchronously synchronized to the `events` table in Supabase in the background, while maintaining instant synchronous `localStorage` updates so the UI remains 100% responsive and offline-ready.

### ADR-003: Single-Page Tabbed Workspace for Event Management
- **Context:** Switching between multiple slow routes hurts UX during event planning.
- **Decision:** Each event (`/events/[id]`) uses a unified dashboard with 5 views: `Overview`, `Budget Tracker`, `Timeline & Milestones`, `Vendor Checklist`, and `AI Theme & Ideas Studio`.

---

## Phase Progress Tracker
- [x] **Phase 1: Project Setup, Types & Landing + Event Intake Wizard** *(Completed)*
  - Created `src/types/event.ts` with strict TypeScript interfaces for `EventPlan`, `BudgetItem`, `TimelineItem`, `VendorItem`, `IdeaItem`, and `CreateEventInput`.
  - Built local-first persistence in `src/lib/storage.ts` & `src/lib/starterPlan.ts` with seed demo blueprints for instant preview.
  - Built high-converting landing page (`src/app/page.tsx`) with category showcases (Weddings, Birthdays, Community events), feature pillars, and live `localStorage` saved blueprints dashboard.
  - Implemented 3-step interactive intake wizard (`src/components/CreateEventWizard.tsx` and modular step subcomponents) supporting multi-currency (`₹`, `$`, `€`, `£`), guest scaling, and vibe tag selection.
  - Maintained strict component modularity (all files < 250 lines) and verified with zero-warning Next.js production builds.

- [x] **Phase 2: Gemini API Route with Structured JSON Blueprint Generation** *(Completed)*
  - Installed official `@google/genai` and `lucide-react` SDKs.
  - Implemented `src/app/api/generate-plan/route.ts` with the exact Gemini 2.5 Flash structured output schema (`Type.OBJECT`, `Type.ARRAY`) for `budgetBreakdown`, `timeline`, `vendorChecklist`, and `personalizedIdeas`.
  - Added graceful degradation (Demo Mode) so the app stays 100% interactive even when `GEMINI_API_KEY` is not yet configured.
  - Connected `CreateEventWizard` to POST directly to `/api/generate-plan` with an animated 3-stage loading state (`WizardLoadingState.tsx` cycling through venue & catering, timeline, and vendor/DIY idea generation).
  - Saved returned plans directly to `localStorage` via `storage.ts` and seamlessly routed to `/events/[id]`.
  - Created initial `/events/[id]` workspace with modular tab components (`BudgetTab`, `TimelineTab`, `VendorsTab`, `IdeasTab`) all adhering to `< 250 lines`.
  - Production build verified with zero warnings.

- [x] **Phase 3: Interactive Event Workspace (Budget, Timeline, Vendors, Ideas Tabs)** *(Completed)*
  - Built `EventHeader.tsx` featuring dynamic event countdown calculation ("X days to go"), guest count, event vibe badge, and real-time overall readiness score meter (0-100%).
  - Built interactive `BudgetTab.tsx`: 4 Top KPI cards (Total, Estimated, Actual, Remaining with red alert if over budget), visual horizontal stacked percentage distribution bar, inline inputs for `actualCost` & `estimatedCost`, custom line-item addition/deletion, and auto-recalculation.
  - Built interactive `TimelineTab.tsx`: Chronological milestone groups, overall completion progress bar, filter pills (`All`, `Pending`, `Completed`, `High Priority`), task checkbox toggles, priority badges, and custom task creation.
  - Built interactive `VendorsTab.tsx`: Vendor cards with status selector (`Researching`, `Contacted`, `Quoted`, `Booked`), estimated budgets, collapsible accordion for "Questions to Ask Before Booking", and custom vendor creation.
  - Built interactive `IdeasTab.tsx`: Concept cards with category tags (`Theme`, `Food & Drink`, `Activity`, `Memorable Touch`), "💡 DIY Budget Hack" callout boxes, bookmark toggle with filter, and custom concept creation.
  - Integrated local-first instant persistence across all tab edits via `src/lib/storage.ts` with visual autosave indicator.
  - Strictly enforced `< 250 lines` component modularity across all files.

- [x] **Phase 4: AI Co-Pilot & Executive Export** *(Completed)*
  - Created slide-over AI Co-Pilot drawer (`src/components/event/AICopilotDrawer.tsx`) with animated backdrop, conversation log, copy-to-clipboard actions, and typing indicator.
  - Implemented `/api/copilot/route.ts` using `gemini-2.5-flash` with contextual event parameters (headcount, vibe, budget breakdown, active vendors).
  - Wired up 3 quick action prompts: *"Optimize my budget to save 15%"*, *"Draft an inquiry email to a [Vendor Type] for my event"*, and *"Generate a Day-Of hour-by-hour run sheet"*.
  - Added "Export / Print Event Blueprint" button in `EventHeader.tsx` triggering print optimization via clean `@media print` styles for PDF generation.
  - Preserved strict component modularity (< 250 lines) and verified with clean Next.js production build.

- [x] **Phase 5 (Storage Sync): Supabase Cloud Persistence with LocalStorage Fallback** *(Completed)*
  - Installed `@supabase/supabase-js`.
  - Created `src/lib/supabase.ts` with environment variable validation (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
  - Updated `src/lib/storage.ts` with dual-write synchronization: instant local synchronous update + asynchronous background upsert/delete to Supabase `events` table matching `database-schema.md`.
  - Added `syncFromSupabase()` in `src/lib/storage.ts` to merge cloud events into local state on application startup.
