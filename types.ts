export type OrganizerType = 'verified_ngo' | 'temple' | 'verified_ind' | 'unverified';

export type BhandaraCategory = 
  | 'Navratri' 
  | 'Guru Purnima' 
  | 'Langar' 
  | 'Wedding Donation' 
  | 'Prasad' 
  | 'Hanuman Jayanti' 
  | 'Shivratri' 
  | 'Other';

export type FoodType = 'सात्विक' | 'प्रसाद' | 'लंगर' | 'अन्नदान' | 'मिठाई' | 'All';

export interface BhandaraEvent {
  id: string;
  name: string;
  organizer: string;
  organizerType: OrganizerType;
  phone?: string;
  location: string;
  lat: number;
  lng: number;
  mapLink?: string;
  category: BhandaraCategory;
  date: string; // YYYY-MM-DD
  isRecurring?: boolean;
  recurrenceFrequency?: 'weekly' | 'monthly';
  startTime: string; // HH:MM
  endTime?: string; // HH:MM
  food: string; // Comma separated items e.g., "Poori Sabzi, Halwa, Kheer"
  description?: string;
  featured: boolean;
  imageURLs: string[];
  statusOverride?: 'open' | 'soon' | 'closed' | 'auto';
  estimatedMeals?: number;
  createdAt: string;
  ratingAvg?: number;
  ratingCount?: number;
  reportedCount?: number;
  isVerified?: boolean;
  verifiedByAdmin?: boolean;
}

export interface Review {
  id: string;
  bhandaraId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  crowdLevel: 'Low' | 'Medium' | 'High';
  foodQuality: 'Excellent' | 'Good' | 'Average';
  createdAt: string;
}

export interface VolunteerRegistration {
  id: string;
  bhandaraId?: string;
  bhandaraName?: string;
  name: string;
  phone: string;
  serviceArea: 'Serving' | 'Cooking' | 'Cleaning' | 'Logistics' | 'Any';
  availability: 'Today' | 'Weekends' | 'Whenever Needed';
  createdAt: string;
}

export interface InKindNeed {
  id: string;
  bhandaraId: string;
  bhandaraName: string;
  item: string; // e.g. "20kg Aata", "50L Milk"
  quantityNeeded: string;
  quantityFulfilled: string;
  status: 'Open' | 'Partially Fulfilled' | 'Fulfilled';
  contactPhone: string;
  createdAt: string;
}

export interface FlagReport {
  id: string;
  bhandaraId: string;
  bhandaraName: string;
  reason: 'Fake Entry' | 'Event Ended / Cancelled' | 'Wrong Location' | 'Inappropriate Content' | 'Other';
  details: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export type Language = 'hi' | 'en';
export type FontSize = 'small' | 'normal' | 'large';
