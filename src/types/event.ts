export type EventType = 'wedding' | 'birthday' | 'community';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';
export type CurrencySymbol = '₹' | '$' | '€' | '£';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: CurrencySymbol;
  label: string;
}

export const CURRENCY_OPTIONS: CurrencyConfig[] = [
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
];

export interface BudgetItem {
  id: string;
  category: string;
  estimatedCost: number;
  actualCost: number;
  percentage: number;
  notes: string;
}

export interface TimelineItem {
  id: string;
  timeframe: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export type VendorStatus = 'Researching' | 'Contacted' | 'Quoted' | 'Booked';

export interface VendorItem {
  id: string;
  vendorType: string;
  status: VendorStatus;
  estimatedBudget: number;
  questionsToAsk: string[];
  contactInfo?: string;
  notes?: string;
}

export interface IdeaItem {
  id: string;
  category: 'Theme' | 'Food & Drink' | 'Icebreaker/Activity' | 'Memorable Touch' | string;
  title: string;
  description: string;
  diyOption: string;
  bookmarked?: boolean;
}

export interface CreateEventInput {
  eventType: EventType;
  eventName: string;
  date: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: CurrencySymbol | string;
  vibe: string;
  specialRequests?: string;
}

export interface EventPlan {
  id: string;
  userId?: string | null;
  eventType: EventType;
  eventName: string;
  date: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: string;
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
