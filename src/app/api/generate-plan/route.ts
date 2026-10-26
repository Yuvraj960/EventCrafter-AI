import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { EventPlan, CreateEventInput } from '@/types/event';
import { createInitialEventPlan } from '@/lib/starterPlan';

const eventPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: 'A warm, encouraging overview of the event concept.' },
    budgetBreakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING, description: 'e.g., Venue, Catering, Decor, Entertainment, Photography' },
          estimatedCost: { type: Type.NUMBER },
          actualCost: { type: Type.NUMBER, description: 'Initialize to 0' },
          percentage: { type: Type.NUMBER },
          notes: { type: Type.STRING, description: 'Cost-saving tip or recommendation' },
        },
        required: ['id', 'category', 'estimatedCost', 'actualCost', 'percentage', 'notes'],
      },
    },
    timeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          timeframe: { type: Type.STRING, description: "e.g., '3 Months Before', '1 Month Before', '1 Week Before', 'Event Day'" },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          priority: { type: Type.STRING, description: 'High, Medium, or Low' },
          completed: { type: Type.BOOLEAN, description: 'Initialize to false' },
        },
        required: ['id', 'timeframe', 'title', 'description', 'priority', 'completed'],
      },
    },
    vendorChecklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          vendorType: { type: Type.STRING, description: 'e.g., Photographer, Caterer, Venue Space, Florist' },
          status: { type: Type.STRING, description: "Initialize to 'Researching'" },
          estimatedBudget: { type: Type.NUMBER },
          questionsToAsk: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '3 crucial questions the user should ask before booking this vendor',
          },
        },
        required: ['id', 'vendorType', 'status', 'estimatedBudget', 'questionsToAsk'],
      },
    },
    personalizedIdeas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING, description: 'Theme, Food & Drink, Icebreaker/Activity, or Memorable Touch' },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          diyOption: { type: Type.STRING, description: 'How to do this on a budget' },
        },
        required: ['id', 'category', 'title', 'description', 'diyOption'],
      },
    },
  },
  required: ['summary', 'budgetBreakdown', 'timeline', 'vendorChecklist', 'personalizedIdeas'],
};

export async function POST(req: Request) {
  try {
    const body: CreateEventInput = await req.json();
    const {
      eventType,
      eventName,
      date,
      location,
      guestCount,
      totalBudget,
      currency = '$',
      vibe,
      specialRequests,
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Falling back to high-fidelity starter generator (Demo Mode).');
      const fallbackPlan = createInitialEventPlan(body);
      return NextResponse.json({ plan: fallbackPlan, source: 'fallback' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Create a comprehensive, realistic event plan for the following event:
      - Event Type: ${eventType} (Wedding / Birthday / Community Event)
      - Title: ${eventName}
      - Date: ${date}
      - Location/City: ${location}
      - Guest Count: ${guestCount}
      - Total Budget: ${currency}${totalBudget}
      - Vibe / Theme Preferences: ${vibe}
      - Special Requirements: ${specialRequests || 'None'}

      Instructions:
      1. Ensure that the sum of estimatedCost across all budgetBreakdown categories equals the Total Budget (${totalBudget}).
      2. Set actualCost to 0 for all budget items.
      3. For timeline items, provide 5-8 chronological tasks from several months out through Event Day, setting completed to false.
      4. For vendorChecklist, status should be 'Researching' and provide 3 sharp, protective questions to ask before hiring.
      5. Tailor personalized ideas specifically to a ${eventType} with a "${vibe}" vibe, including creative "diyOption" budget hacks.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: eventPlanSchema,
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    const generatedPlan: EventPlan = {
      id: 'evt_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36),
      userId: null,
      eventType,
      eventName,
      date,
      location,
      guestCount: Number(guestCount) || 50,
      totalBudget: Number(totalBudget) || 5000,
      currency: currency || '$',
      vibe: vibe || 'Custom Vibe',
      specialRequests: specialRequests || '',
      summary: parsed.summary || `A beautifully designed ${eventType} plan for ${eventName}.`,
      budgetBreakdown: parsed.budgetBreakdown || [],
      timeline: parsed.timeline || [],
      vendorChecklist: parsed.vendorChecklist || [],
      personalizedIdeas: parsed.personalizedIdeas || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ plan: generatedPlan, source: 'gemini' });
  } catch (error) {
    console.error('Gemini Generation Error:', error);
    try {
      const fallbackPlan = createInitialEventPlan(await req.json());
      return NextResponse.json({ plan: fallbackPlan, source: 'fallback_on_error' });
    } catch {
      return NextResponse.json({ error: 'Failed to generate event plan' }, { status: 500 });
    }
  }
}
