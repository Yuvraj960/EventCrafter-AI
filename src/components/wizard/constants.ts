import { EventType } from '@/types/event';

export const THEME_TAGS_BY_TYPE: Record<EventType, string[]> = {
  wedding: ['Rustic Romance', 'Modern Luxury', 'Boho Chic', 'Traditional & Cultural', 'Beachside / Coastal', 'Intimate Minimalist'],
  birthday: ['Retro Disco & Neon', 'Glow in the Dark', 'Y2K Nostalgia', 'Hollywood Red Carpet', 'Tropical Luau', 'Cyberpunk Arcade'],
  community: ['Eco-Friendly & Green', 'Street Food & Artisan Market', 'Civic Charity Gala', 'Tech & Innovation Demo', 'Block Party & Games'],
};
