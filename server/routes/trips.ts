import { Router } from 'express';
import Trip from '../models/Trip.js';
import { requireAuth, AuthedRequest } from './auth.js';

const router = Router();

// Every trip endpoint requires a logged-in user
router.use(requireAuth);

const serialize = (t: any) => ({
  id: String(t._id),
  title: t.title,
  destination: t.destination,
  district: t.district,
  days: t.days,
  budgetBDT: t.budgetBDT,
  budgetUSD: t.budgetUSD,
  persona: t.persona,
  status: t.status,
  startDate: t.startDate,
  endDate: t.endDate,
  itinerary: t.itinerary,
  placesVisited: t.placesVisited,
  travelersCount: t.travelersCount,
  notes: t.notes,
  createdDate: t.createdDate,
});

/* GET /api/trips — only the current user's trips */
router.get('/', async (req: AuthedRequest, res) => {
  try {
    const trips = await Trip.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json({ success: true, trips: trips.map(serialize) });
  } catch (error) {
    console.error('Fetch trips error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load trips' });
  }
});

/* POST /api/trips — create a trip owned by the current user */
router.post('/', async (req: AuthedRequest, res) => {
  try {
    const { id, _id, userId, ...body } = req.body || {};
    if (!body.title || !body.destination) {
      return res.status(400).json({ success: false, message: 'Title and destination are required' });
    }
    const trip = await Trip.create({ ...body, userId: req.userId });
    return res.status(201).json({ success: true, message: 'Trip saved', trip: serialize(trip) });
  } catch (error) {
    console.error('Create trip error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save trip' });
  }
});

/* DELETE /api/trips/:id — only if the trip belongs to the current user */
router.delete('/:id', async (req: AuthedRequest, res) => {
  try {
    const deleted = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    return res.json({ success: true, message: 'Trip deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete trip' });
  }
});

export default router;
