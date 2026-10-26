import { CreateEventInput, EventPlan, BudgetItem, TimelineItem, VendorItem, IdeaItem } from '@/types/event';

export function createInitialEventPlan(input: CreateEventInput): EventPlan {
  const id = 'evt_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
  const now = new Date().toISOString();
  const total = Number(input.totalBudget) || 5000;

  const budgetBreakdown: BudgetItem[] = [
    {
      id: 'b1',
      category: 'Venue & Logistics',
      estimatedCost: Math.round(total * 0.35),
      actualCost: 0,
      percentage: 35,
      notes: 'Main space rental, security deposit, and utilities',
    },
    {
      id: 'b2',
      category: 'Catering & Beverages',
      estimatedCost: Math.round(total * 0.30),
      actualCost: 0,
      percentage: 30,
      notes: `Food & beverage service calculated for ${input.guestCount} guests`,
    },
    {
      id: 'b3',
      category: 'Decor & Theme Styling',
      estimatedCost: Math.round(total * 0.15),
      actualCost: 0,
      percentage: 15,
      notes: `Custom decorations highlighting ${input.vibe || 'chosen vibe'}`,
    },
    {
      id: 'b4',
      category: 'Photography & Media',
      estimatedCost: Math.round(total * 0.12),
      actualCost: 0,
      percentage: 12,
      notes: 'Full coverage + highlight reel and edited photo package',
    },
    {
      id: 'b5',
      category: 'Contingency & Reserve',
      estimatedCost: Math.round(total * 0.08),
      actualCost: 0,
      percentage: 8,
      notes: 'Buffer reserve for unexpected adjustments',
    },
  ];

  const timeline: TimelineItem[] = [
    {
      id: 't1',
      timeframe: '3 Months Before',
      title: 'Lock Venue & Core Theme',
      description: `Confirm reservation in ${input.location || 'selected city'} and align styling with "${input.vibe}" vibe.`,
      priority: 'High',
      completed: true,
    },
    {
      id: 't2',
      timeframe: '1 Month Before',
      title: 'Finalize Guest List & Invitations',
      description: `Send invitations for target ${input.guestCount} attendees. Track RSVPs.`,
      priority: 'High',
      completed: false,
    },
    {
      id: 't3',
      timeframe: '2 Weeks Before',
      title: 'Vendor Confirmations & Walkthrough',
      description: 'Review run of show with caterers, sound technician, and coordinator.',
      priority: 'Medium',
      completed: false,
    },
    {
      id: 't4',
      timeframe: 'Week Of',
      title: 'Final Headcount & Payments',
      description: 'Submit guaranteed headcount and prepare vendor settlement disbursements.',
      priority: 'High',
      completed: false,
    },
    {
      id: 't5',
      timeframe: 'Event Day',
      title: 'On-site Execution & Setup',
      description: 'Oversee morning load-in, AV soundcheck, and guest reception sequence.',
      priority: 'High',
      completed: false,
    },
  ];

  const vendorChecklist: VendorItem[] = [
    {
      id: 'v1',
      vendorType: 'Primary Venue Space',
      status: 'Quoted',
      estimatedBudget: Math.round(total * 0.35),
      questionsToAsk: [
        'What are the designated load-in and curfew hours?',
        'Is outside catering permitted without penalty fees?',
        'What AV and lighting infrastructure is included?',
      ],
    },
    {
      id: 'v2',
      vendorType: 'Catering & Bar Service',
      status: 'Researching',
      estimatedBudget: Math.round(total * 0.30),
      questionsToAsk: [
        'Can menus accommodate dietary and allergy restrictions?',
        'Are staffing, cutlery, and linens included in quotes?',
        'What is your corkage or bar management policy?',
      ],
    },
    {
      id: 'v3',
      vendorType: 'Photographer / Videographer',
      status: 'Researching',
      estimatedBudget: Math.round(total * 0.12),
      questionsToAsk: [
        'How many continuous coverage hours are included?',
        'What is the turnaround time for digital previews?',
        'Do you provide full-resolution downloadable galleries?',
      ],
    },
  ];

  const personalizedIdeas: IdeaItem[] = [
    {
      id: 'i1',
      category: 'Theme',
      title: `${input.vibe || 'Signature'} Atmosphere Curation`,
      description: `Layer textures, ambient lighting, and bespoke typography accents tuned to the ${input.vibe} aesthetic.`,
      diyOption: 'Use fairy light canopies and thrifted architectural frames with handwritten signage.',
    },
    {
      id: 'i2',
      category: 'Food & Drink',
      title: 'Interactive Signature Beverage Bar',
      description: 'Feature 2 custom mocktails/cocktails inspired by meaningful milestones.',
      diyOption: 'Batch make floral syrups and infuse iced sparkling water dispensers with citrus & fresh mint.',
    },
    {
      id: 'i3',
      category: 'Memorable Touch',
      title: 'Audio Guestbook & Keepsake Station',
      description: 'A station where attendees record voice memos and snap keepsake instant photos.',
      diyOption: 'Repurpose a vintage rotary phone linked to a mini recorder or supply 2 instant cameras.',
    },
  ];

  return {
    id,
    userId: null,
    eventType: input.eventType,
    eventName: input.eventName,
    date: input.date,
    location: input.location,
    guestCount: Number(input.guestCount) || 50,
    totalBudget: total,
    currency: input.currency || '$',
    vibe: input.vibe,
    specialRequests: input.specialRequests,
    summary: `A curated ${input.eventType} celebration in ${input.location || 'your selected destination'}, designed for ${input.guestCount} guests embracing a ${input.vibe} theme.`,
    budgetBreakdown,
    timeline,
    vendorChecklist,
    personalizedIdeas,
    createdAt: now,
    updatedAt: now,
  };
}
