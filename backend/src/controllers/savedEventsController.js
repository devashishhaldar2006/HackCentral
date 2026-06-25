import mongoose from 'mongoose';
import User from '../models/User.js';
import Event from '../models/Event.js';
import { logActivity } from '../lib/utils.js';

// Add an event to user's bookmarked events
export const saveEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ success: false, message: 'Event ID is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid Event ID' });
    }

    // Verify the event exists before creating a dangling reference
    const eventExists = await Event.exists({ _id: eventId });
    if (!eventExists) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Prevent duplicates
    const alreadySaved = user.bookmarkedEvents.some(
      (id) => id.toString() === eventId.toString()
    );
    if (!alreadySaved) {
      user.bookmarkedEvents.push(eventId);
      await user.save();
      // Log activity + award XP for bookmarking
      logActivity(userId, 'bookmark', eventId, 2);
    }
    return res.status(200).json({ success: true, message: 'Event saved',
      bookmarkedEvents: user.bookmarkedEvents,
    });
  } catch (err) {
    console.error('saveEvent error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove an event from bookmarks
export const unsaveEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ success: false, message: 'Event ID is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid Event ID' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.bookmarkedEvents = user.bookmarkedEvents.filter(
      (id) => id.toString() !== eventId.toString()
    );
    await user.save();
    // Log unbookmark activity (no XP)
    logActivity(userId, 'unbookmark', eventId, 0);
    return res.status(200).json({ success: true, message: 'Event removed from saved',
      bookmarkedEvents: user.bookmarkedEvents,
    });
  } catch (err) {
    console.error('unsaveEvent error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all saved events (populated) for the logged-in user
export const getSavedEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('bookmarkedEvents');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ savedEvents: user.bookmarkedEvents });
  } catch (err) {
    console.error('getSavedEvents error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
