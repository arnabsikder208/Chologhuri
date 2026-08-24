export type PersonaType = 
  | 'Foreign Tourists'
  | 'Solo Travelers'
  | 'Couples'
  | 'Families'
  | 'Female Travelers'
  | 'Backpackers'
  | 'Tour Guides'
  | 'Hotels'
  | 'Restaurants'
  | 'Travel Agencies'
  | 'Admin';

export type DistrictType =
  | 'Chattogram City'
  | 'Cox\'s Bazar'
  | 'Bandarban'
  | 'Rangamati'
  | 'Sitakunda'
  | 'Mirsarai'
  | 'Anwara'
  | 'Khagrachhari';

export type CategoryType =
  | 'Beach & Coastal'
  | 'Hill Tracts & Valleys'
  | 'Waterfalls & Springs'
  | 'Lakes & Waterways'
  | 'Heritage & Eco Parks';

export interface RouteOption {
  from: string;
  to: string;
  mode: 'Bus' | 'Train' | 'Flight' | 'CNG / Local Taxi' | 'Boat / Launch' | 'Chander Gari (Jeep)';
  costBDT: number;
  duration: string;
}

export interface Destination {
  id: string;
  name: string;
  division: 'Chattogram Division';
  district: DistrictType;
  category: CategoryType;
  image: string;
  shortDesc: string;
  fullDesc: string;
  attractions: string[];
  travelRoutes: RouteOption[];
  estimatedBudgetBDT: {
    budget: number;
    midRange: number;
    luxury: number;
  };
  visitorTips: string[];
  bestTimeToVisit: string;
  rating: number;
  reviewsCount: number;
  coordinates: { lat: number; lng: number };
  popular: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  destinationName: string;
  district: DistrictType;
  rating: number;
  reviewsCount: number;
  pricePerNightBDT: number;
  pricePerNightUSD: number;
  image: string;
  images: string[];
  amenities: string[];
  roomTypes: string[];
  address: string;
  coordinates: { lat: number; lng: number };
  featured: boolean;
}

export interface BlogComment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  date: string;
}

export interface Blog {
  id: string;
  title: string;
  subtitle: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishDate: string;
  category: string;
  destinationName: string;
  image: string;
  content: string;
  readTime: string;
  likes: number;
  commentsCount: number;
  comments: BlogComment[];
  featured?: boolean;
}

export interface ItineraryDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  estExpenseBDT: number;
}

export interface TripPlan {
  id: string;
  title: string;
  destination: string;
  district: DistrictType;
  days: number;
  budgetBDT: number;
  budgetUSD: number;
  persona: PersonaType;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  startDate: string;
  endDate: string;
  itinerary: ItineraryDay[];
  placesVisited: string[];
  travelersCount: number;
  notes: string;
  createdDate: string;
}

export interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    badge: string;
    persona: PersonaType;
  };
  title: string;
  content: string;
  destinationName: string;
  image?: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  date: string;
  type: 'Story' | 'Discussion' | 'CompanionSeeker';
}

export interface TravelGroup {
  id: string;
  name: string;
  destination: string;
  district: DistrictType;
  memberCount: number;
  maxMembers: number;
  image: string;
  tags: string[];
  organizer: string;
  dateRange: string;
}

export interface MongoCollectionDoc {
  name: string;
  description: string;
  count: number;
  fields: { field: string; type: string; required: boolean; description: string }[];
}

export interface RestEndpointDoc {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  sampleParams?: string;
  sampleBody?: string;
}

export interface UserProfile {
  id: string;          // MongoDB user _id — trips are scoped to this
  name: string;
  email: string;
  phone: string;
  dob: string;
  avatar: string;
  role: PersonaType;
  totalTrips: number;
  placesVisitedCount: number;
  totalSpentBDT: number;
  currency: 'BDT' | 'USD';
}

/** Shape returned by /api/auth endpoints */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  avatar?: string;
}

export type ThemeMode = 'light' | 'dark';
