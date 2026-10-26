import { EventPlan } from '@/types/event';
import { createInitialEventPlan } from './starterPlan';
import { supabase, isSupabaseConfigured } from './supabase';

export { createInitialEventPlan, isSupabaseConfigured };

const STORAGE_KEY = 'eventcraft_saved_events';

function mapToDbRow(event: EventPlan) {
  return {
    id: event.id,
    user_id: event.userId || null,
    event_type: event.eventType,
    event_name: event.eventName,
    event_date: event.date || null,
    location: event.location || '',
    guest_count: Number(event.guestCount) || 50,
    total_budget: Number(event.totalBudget) || 5000,
    currency: event.currency || '$',
    vibe: event.vibe || '',
    summary: event.summary || '',
    budget_breakdown: event.budgetBreakdown || [],
    timeline: event.timeline || [],
    vendor_checklist: event.vendorChecklist || [],
    personalized_ideas: event.personalizedIdeas || [],
    created_at: event.createdAt || new Date().toISOString(),
    updated_at: event.updatedAt || new Date().toISOString(),
  };
}

function mapFromDbRow(row: Record<string, unknown>): EventPlan {
  return {
    id: String(row.id),
    userId: row.user_id ? String(row.user_id) : null,
    eventType: (row.event_type as EventPlan['eventType']) || 'wedding',
    eventName: String(row.event_name || 'Untitled Event'),
    date: row.event_date ? String(row.event_date) : '',
    location: String(row.location || ''),
    guestCount: Number(row.guest_count) || 50,
    totalBudget: Number(row.total_budget) || 5000,
    currency: String(row.currency || '$'),
    vibe: String(row.vibe || ''),
    specialRequests: row.special_requests ? String(row.special_requests) : '',
    summary: String(row.summary || ''),
    budgetBreakdown: Array.isArray(row.budget_breakdown) ? (row.budget_breakdown as EventPlan['budgetBreakdown']) : [],
    timeline: Array.isArray(row.timeline) ? (row.timeline as EventPlan['timeline']) : [],
    vendorChecklist: Array.isArray(row.vendor_checklist) ? (row.vendor_checklist as EventPlan['vendorChecklist']) : [],
    personalizedIdeas: Array.isArray(row.personalized_ideas) ? (row.personalized_ideas as EventPlan['personalizedIdeas']) : [],
    createdAt: String(row.created_at || new Date().toISOString()),
    updatedAt: String(row.updated_at || new Date().toISOString()),
  };
}

async function syncToSupabaseAsync(row: ReturnType<typeof mapToDbRow>) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('events').upsert(row);
    if (error) console.warn('Supabase sync warning:', error.message);
  } catch (err) {
    console.warn('Supabase network sync issue:', err);
  }
}

async function deleteFromSupabaseAsync(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) console.warn('Supabase delete warning:', error.message);
  } catch (err) {
    console.warn('Supabase network delete issue:', err);
  }
}

export function getEvents(): EventPlan[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading events from localStorage:', err);
    return [];
  }
}

export function getEventById(id: string): EventPlan | null {
  const events = getEvents();
  return events.find((e) => e.id === id) || null;
}

export function saveEvent(event: EventPlan): void {
  if (typeof window === 'undefined') return;
  try {
    const events = getEvents();
    const index = events.findIndex((e) => e.id === event.id);
    const updatedPlan = { ...event, updatedAt: new Date().toISOString() };

    if (index >= 0) {
      events[index] = updatedPlan;
    } else {
      events.unshift(updatedPlan);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));

    // Background sync to Supabase if configured
    syncToSupabaseAsync(mapToDbRow(updatedPlan));
  } catch (err) {
    console.error('Error saving event:', err);
  }
}

export function deleteEvent(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const events = getEvents().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));

    // Background delete in Supabase if configured
    deleteFromSupabaseAsync(id);
    return true;
  } catch (err) {
    console.error('Error deleting event:', err);
    return false;
  }
}

export async function syncFromSupabase(): Promise<EventPlan[]> {
  const localEvents = getEvents();
  if (!isSupabaseConfigured || !supabase || typeof window === 'undefined') {
    return localEvents;
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Could not fetch events from Supabase:', error?.message);
      return localEvents;
    }

    const cloudEvents = data.map((r) => mapFromDbRow(r as Record<string, unknown>));
    const mergedMap = new Map<string, EventPlan>();

    [...localEvents, ...cloudEvents].forEach((item) => {
      const existing = mergedMap.get(item.id);
      if (!existing || new Date(item.updatedAt) > new Date(existing.updatedAt)) {
        mergedMap.set(item.id, item);
      }
    });

    const merged = Array.from(mergedMap.values());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (err) {
    console.warn('Supabase fetch failed, utilizing localStorage:', err);
    return localEvents;
  }
}

export function seedDemoEventsIfEmpty(): EventPlan[] {
  const existing = getEvents();
  if (existing.length > 0) return existing;

  const demoWedding = createInitialEventPlan({
    eventType: 'wedding',
    eventName: 'Seraphina & Liam’s Tuscan Garden Wedding',
    date: '2026-09-18',
    location: 'Napa Valley, CA',
    guestCount: 120,
    totalBudget: 35000,
    currency: '$',
    vibe: 'Rustic Italian Luxury & Warm Candlelight',
    specialRequests: 'Olive branch accents, acoustic strings quartet, farm-to-table vegetarian options.',
  });

  const demoBirthday = createInitialEventPlan({
    eventType: 'birthday',
    eventName: 'Maya’s 30th Retro Roller Disco',
    date: '2026-07-11',
    location: 'Austin, TX',
    guestCount: 65,
    totalBudget: 6000,
    currency: '$',
    vibe: 'Retro 80s Neon, Disco Balls & Funk Vibes',
    specialRequests: 'Custom neon photo backdrop, artisanal slider bar, roller skate rentals.',
  });

  saveEvent(demoWedding);
  saveEvent(demoBirthday);

  return [demoWedding, demoBirthday];
}
