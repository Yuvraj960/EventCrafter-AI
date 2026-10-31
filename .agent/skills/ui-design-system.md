# Skill: UI/UX Design System for EventCraft AI

## 1. Visual Identity by Event Type
Dynamically theme accents based on the selected `eventType`:
- **Wedding:** Rose & Champagne palette (`rose-600`, `amber-50`, elegant serif headings).
- **Birthday:** Vibrant Violet & Coral palette (`violet-600`, `fuchsia-50`, playful rounded badges).
- **Community Event:** Emerald & Teal palette (`emerald-600`, `teal-50`, clean civic/collaborative feel).

## 2. Must-Have Interactive UX Features
1. **Budget Tracker Tab:**
   - Top KPI Cards: *Total Budget*, *Estimated Spend*, *Actual Spend*, *Remaining Balance* (turns red if over budget).
   - Visual horizontal stacked progress bar showing category percentages.
   - Inline editing: Users can click any category's `actualCost`, edit it, or add a new custom budget line item.
2. **Timeline & Milestones Tab:**
   - Grouped by `timeframe` (e.g., *3 Months Out*, *1 Month Out*, *Week Of*, *Event Day*).
   - Overall completion progress bar at the top (`X of Y tasks completed - Z%`).
   - Filter pills: `All`, `Pending`, `Completed`, `High Priority`.
3. **Vendor Checklist Tab:**
   - Kanban or Status Card view with status dropdown (`Researching` -> `Contacted` -> `Quoted` -> `Booked`).
   - Expandable accordion on each vendor showing AI-generated **"Questions to Ask Before Booking"**.
4. **Personalized Ideas Studio Tab:**
   - Masonry/Grid cards with category badges (`Theme`, `Food & Drink`, `Activity`, `Memorable Touch`).
   - Highlighted **"💡 DIY Budget Hack"** callout box inside each card.
   - "Generate 3 More Ideas" button that queries Gemini for fresh ideas based on user feedback.