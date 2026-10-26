# GEMINI.md - Project Context & Ruleset

## 1. Project Overview
**App Name:** EventCraft AI
**Problem Statement:** A GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events with interactive budgets, chronological timelines, vendor checklists, and personalized theme/activity ideas.

## 2. Tech Stack (Strictly Enforced)
- **Framework:** Next.js (App Router, `src/` directory, TypeScript)
- **Styling:** Tailwind CSS + `shadcn/ui` + `lucide-react`
- **Database & Auth:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **AI SDK:** Official Google Gen AI SDK (`@google/genai`) — **NEVER** use the deprecated `@google/generative-ai` package.
- **AI Model:** Always use `gemini-2.5-flash` for fast text/JSON generation.

## 3. Strict Coding Guidelines
1. **No Hallucinated Packages:** Only use packages already in `package.json` or explicitly ask before installing new ones.
2. **Gemini API Usage Rule:**
   - Always call Gemini on the server side (Next.js Server Actions or Route Handlers in `src/app/api/`). Never expose `GEMINI_API_KEY` to the client.
   - Always use `responseMimeType: "application/json"` and `responseSchema` (using `Type` from `@google/genai`) when generating budgets, timelines, checklists, and ideas.
3. **Graceful Degradation (Demo Mode):**
   - If Supabase env variables are missing or the user isn't logged in yet, fall back to `localStorage` so the app remains 100% testable and interactive at every stage.
4. **TypeScript Strictness:**
   - Define shared interfaces in `src/types/event.ts`. Do not use `any`.
5. **Component Modularity:**
   - Keep files under 250 lines. Split dashboard tabs (`BudgetTab`, `TimelineTab`, `VendorsTab`, `IdeasTab`) into separate components inside `src/components/event/`.

## 4. Environment Variables (`.env.local`)
```env
GEMINI_API_KEY="your_google_ai_studio_key"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"