import express from 'express';
import { authProtect } from '../middlewares/authMiddleware.js';
import {
  saveEvent,
  unsaveEvent,
  getSavedEvents,
} from '../controllers/savedEventsController.js';

const router = express.Router();

// GET  /api/saved  → get all saved events for logged-in user
router.get('/', authProtect, getSavedEvents);

// POST /api/saved/save → bookmark an event
router.post('/save', authProtect, saveEvent);

// POST /api/saved/unsave → remove bookmark
router.post('/unsave', authProtect, unsaveEvent);

export default router;
