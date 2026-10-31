# Skill: Gemini Structured Output for Event Blueprints

When implementing or updating the AI generation endpoint (`src/app/api/generate-plan/route.ts`), strictly follow this pattern using `@google/genai`.

## Required Installation
`npm install @google/genai`

## Exact Implementation Pattern
```typescript
import { NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const eventPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A warm, encouraging overview of the event concept." },
    budgetBreakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING, description: "e.g., Venue, Catering, Decor, Entertainment" },
          estimatedCost: { type: Type.NUMBER },
          actualCost: { type: Type.NUMBER, description: "Initialize to 0" },
          percentage: { type: Type.NUMBER },
          notes: { type: Type.STRING, description: "Cost-saving tip or recommendation" }
        },
        required: ["id", "category", "estimatedCost", "actualCost", "percentage", "notes"]
      }
    },
    timeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          timeframe: { type: Type.STRING, description: "e.g., '3 Months Before', '1 Week Before', 'Event Day'" },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          priority: { type: Type.STRING, description: "High, Medium, or Low" },
          completed: { type: Type.BOOLEAN, description: "Initialize to false" }
        },
        required: ["id", "timeframe", "title", "description", "priority", "completed"]
      }
    },
    vendorChecklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          vendorType: { type: Type.STRING, description: "e.g., Photographer, Caterer, Sound System" },
          status: { type: Type.STRING, description: "Initialize to 'Researching'" },
          estimatedBudget: { type: Type.NUMBER },
          questionsToAsk: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 crucial questions the user should ask before booking this vendor"
          }
        },
        required: ["id", "vendorType", "status", "estimatedBudget", "questionsToAsk"]
      }
    },
    personalizedIdeas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING, description: "Theme, Food & Drink, Icebreaker/Activity, or Memorable Touch" },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          diyOption: { type: Type.STRING, description: "How to do this on a budget" }
        },
        required: ["id", "category", "title", "description", "diyOption"]
      }
    }
  },
  required: ["summary", "budgetBreakdown", "timeline", "vendorChecklist", "personalizedIdeas"]
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventType, eventName, date, location, guestCount, totalBudget, vibe, specialRequests } = body;

    const prompt = `
      Create a comprehensive, realistic event plan for the following event:
      - Event Type: ${eventType} (Wedding / Birthday / Community Event)
      - Title: ${eventName}
      - Date: ${date}
      - Location/City: ${location}
      - Guest Count: ${guestCount}
      - Total Budget: ${totalBudget}
      - Vibe / Theme Preferences: ${vibe}
      - Special Requirements: ${specialRequests || "None"}

      Ensure that the sum of estimatedCost in budgetBreakdown equals the Total Budget (${totalBudget}).
      Tailor vendor checklists, cultural/local pricing nuances, and personalized ideas specifically to a ${eventType} with a "${vibe}" vibe.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: eventPlanSchema,
        temperature: 0.7,
      },
    });

    const plan = JSON.parse(response.text || "{}");
    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate event plan" }, { status: 500 });
  }
}