import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITrip extends Document {
  userId: Types.ObjectId;
  title: string;
  destination: string;
  district: string;
  days: number;
  budgetBDT: number;
  budgetUSD: number;
  persona: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  startDate: string;
  endDate: string;
  itinerary: {
    day: number;
    title: string;
    morning: string;
    afternoon: string;
    evening: string;
    estExpenseBDT: number;
  }[];
  placesVisited: string[];
  travelersCount: number;
  notes: string;
  createdDate: string;
}

const itineraryDaySchema = new Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, default: '' },
    morning: { type: String, default: '' },
    afternoon: { type: String, default: '' },
    evening: { type: String, default: '' },
    estExpenseBDT: { type: Number, default: 0 },
  },
  { _id: false }
);

const tripSchema = new Schema<ITrip>(
  {
    // Every trip belongs to exactly one authenticated user
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    destination: { type: String, required: true },
    district: { type: String, default: 'Chattogram City' },
    days: { type: Number, default: 1 },
    budgetBDT: { type: Number, default: 0 },
    budgetUSD: { type: Number, default: 0 },
    persona: { type: String, default: 'Solo Travelers' },
    status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    itinerary: { type: [itineraryDaySchema], default: [] },
    placesVisited: { type: [String], default: [] },
    travelersCount: { type: Number, default: 1 },
    notes: { type: String, default: '' },
    createdDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  },
  { timestamps: true }
);

const Trip = mongoose.model<ITrip>('Trip', tripSchema);

export default Trip;
