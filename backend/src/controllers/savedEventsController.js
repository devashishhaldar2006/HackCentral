import User from '../models/User.js';

// Add an event to user's bookmarked events
export const saveEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent duplicates
    const alreadySaved = user.bookmarkedEvents.some(
      (id) => id.toString() === eventId.toString()
    );
    if (!alreadySaved) {
      user.bookmarkedEvents.push(eventId);
      await user.save();
    }
    return res.status(200).json({
      message: 'Event saved',
      bookmarkedEvents: user.bookmarkedEvents,
    });
  } catch (err) {
    console.error('saveEvent error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Remove an event from bookmarks
export const unsaveEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.bookmarkedEvents = user.bookmarkedEvents.filter(
      (id) => id.toString() !== eventId.toString()
    );
    await user.save();
    return res.status(200).json({
      message: 'Event removed from saved',
      bookmarkedEvents: user.bookmarkedEvents,
    });
  } catch (err) {
    console.error('unsaveEvent error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all saved events (populated) for the logged-in user
export const getSavedEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('bookmarkedEvents');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ savedEvents: user.bookmarkedEvents });
  } catch (err) {
    console.error('getSavedEvents error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
