import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { EventPlan } from '@/types/event';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, event }: { message: string; event: EventPlan } = body;

    if (!message || !event) {
      return NextResponse.json({ error: 'Message and event context are required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Graceful degradation (Demo Mode) with rich contextual responses
      const demoResponse = getFallbackResponse(message, event);
      return NextResponse.json({ reply: demoResponse, source: 'fallback_demo' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
      You are EventCraft AI's elite Co-Pilot, an expert event planner and negotiator.
      Current Event Context:
      - Title: "${event.eventName}" (${event.eventType})
      - Date: ${event.date || 'TBD'} | City: ${event.location || 'Flexible'}
      - Guests: ${event.guestCount} | Total Budget: ${event.currency}${event.totalBudget}
      - Atmosphere & Vibe: ${event.vibe}
      - Special Requests: ${event.specialRequests || 'None'}
      - Active Categories: ${event.budgetBreakdown?.map((b) => `${b.category} (${event.currency}${b.estimatedCost})`).join(', ')}
      - Key Vendors: ${event.vendorChecklist?.map((v) => `${v.vendorType} [${v.status}]`).join(', ')}

      Guidelines:
      1. Be warm, highly structured, practical, and action-oriented.
      2. If drafting an email, format it with Subject Line, greeting, bulleted event specifics, and professional call-to-action.
      3. If optimizing budget, provide concrete dollar tradeoffs and negotiation levers.
      4. If generating a Day-Of schedule, provide precise morning-to-night timestamps.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I analyzed your event details. How else can I help refine your plan?';
    return NextResponse.json({ reply, source: 'gemini' });
  } catch (error) {
    console.error('Co-Pilot Generation Error:', error);
    return NextResponse.json({
      reply: 'I encountered an issue processing your request right now. Please try again or rephrase.',
      source: 'error',
    }, { status: 500 });
  }
}

function getFallbackResponse(message: string, event: EventPlan): string {
  const lower = message.toLowerCase();
  const c = event.currency || '$';

  if (lower.includes('15%') || lower.includes('save') || lower.includes('budget')) {
    const fifteenPercent = Math.round(Number(event.totalBudget) * 0.15);
    return `### 💡 Strategic 15% Budget Optimization (Target Savings: ${c}${fifteenPercent.toLocaleString()})

Here is how to trim 15% from "${event.eventName}" without sacrificing the "${event.vibe}" aesthetic:

1. **Catering & Beverage Pivot (Save ~${c}${Math.round(fifteenPercent * 0.45).toLocaleString()})**:
   - Switch from a plated 3-course dinner to upscale interactive food stations or family-style platters.
   - Limit the bar to 2 signature craft cocktails, beer, and wine rather than an unrestricted top-shelf open bar.

2. **Decor & Lighting Strategy (Save ~${c}${Math.round(fifteenPercent * 0.35).toLocaleString()})**:
   - Invest in warm ambient uplighting and clustered pillar candles instead of costly floral centerpieces.
   - Repurpose ceremony floral arrangements for the reception head table and bar stations.

3. **Vendor Timing Optimization (Save ~${c}${Math.round(fifteenPercent * 0.20).toLocaleString()})**:
   - Book photography for 7 high-impact hours rather than 10 hours, focusing coverage strictly from pre-ceremony through primary dances.`;
  }

  if (lower.includes('email') || lower.includes('vendor') || lower.includes('inquiry')) {
    const vendorType = event.vendorChecklist?.[0]?.vendorType || 'Event Partner';
    return `### ✉️ Inquiry Email Template for ${vendorType}

**Subject:** Inquiry: ${event.eventType.toUpperCase()} Services for ${event.eventName} - ${event.date || 'Upcoming Date'}

Dear ${vendorType} Team,

I hope this email finds you well!

We are currently planning **${event.eventName}** scheduled for **${event.date || '[Date]'}** in **${event.location || '[City]'}**, and we love your work and portfolio.

**Event Details at a Glance:**
- **Event Type:** ${event.eventType}
- **Guest Count:** ~${event.guestCount} guests
- **Theme & Vibe:** ${event.vibe}
- **Budget Allocation:** ~${c}${Math.round(event.totalBudget * 0.25).toLocaleString()}

Could you please share your availability for this date and send over your pricing brochure? Additionally, we would appreciate knowing if your package includes setup and teardown.

Looking forward to hearing from you!

Warm regards,  
**The Planning Team for ${event.eventName}**`;
  }

  return `### ⏱️ Day-Of Hour-by-Hour Master Run Sheet

**Event:** ${event.eventName} | **Headcount:** ${event.guestCount} Guests  
**Vibe:** ${event.vibe}

- **09:00 AM - 11:30 AM**: Vendor load-in, staging, AV sound check & floral delivery.
- **11:30 AM - 01:00 PM**: Key stakeholder arrivals, wardrobe prep & initial detail photography.
- **01:30 PM - 02:30 PM**: Venue walkthrough & final coordinator checklist signoff.
- **03:00 PM - 03:45 PM**: Guest arrivals, welcome refreshments & ambient acoustic music.
- **04:00 PM - 04:45 PM**: Main Ceremony / Keynote presentation.
- **05:00 PM - 06:30 PM**: Cocktail hour, interactive beverage station & golden-hour portraits.
- **06:45 PM - 08:30 PM**: Dinner service, toasts & celebratory speeches.
- **08:30 PM - 11:00 PM**: Dance floor opens, dessert bar, interactive photo booth & late-night snacks.
- **11:00 PM - 12:00 AM**: Grand sparkler / confetti exit & vendor load-out.`;
}
