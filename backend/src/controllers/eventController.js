import Event from "../models/Event.js";
import User from "../models/User.js";
import { validateEventSubmissionData } from "../lib/validate.js";
import { getSafeUserData } from "../lib/safeUser.js";

export const getEvents = async (req, res) => {
  try {
    const {
      search,
      category,
      mode,
      price,
      startDate,
      endDate,
      tag,
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    // Regex search for partial matching (much better user experience than strict $text)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { organizer: searchRegex },
        { location: searchRegex },
        { tags: searchRegex }
      ];
    }

    // Category filter
    if (category && category !== "All") {
      filter.category = category;
    }

    // Mode filter
    if (mode && mode !== "All Modes") {
      filter.mode = mode;
    }

    // Price filter
    if (price && price !== "All") {
      filter.price = price;
    }

    // Tag filter (case-insensitive)
    if (tag) {
      filter.tags = { $regex: new RegExp(`^${tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") };
    }

    // Date range filter
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) {
        const parsedStartDate = new Date(startDate);
        if (isNaN(parsedStartDate.getTime())) return res.status(400).json({ message: "Invalid startDate format" });
        filter.startDate.$gte = parsedStartDate;
      }
      if (endDate) {
        const parsedEndDate = new Date(endDate);
        if (isNaN(parsedEndDate.getTime())) return res.status(400).json({ message: "Invalid endDate format" });
        filter.startDate.$lte = parsedEndDate;
      }
    }

    // Sorting
    let sortOption = {};
    switch (sort) {
      case "oldest":
        sortOption = { startDate: 1 };
        break;
      case "title":
        sortOption = { title: 1 };
        break;
      case "newest":
      default:
        sortOption = { startDate: -1 };
        break;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * pageSize;

    const [events, total] = await Promise.all([
      Event.find(filter).sort(sortOption).skip(skip).limit(pageSize),
      Event.countDocuments(filter),
    ]);

    res.json({
      message: "Events fetched successfully",
      data: events,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      message: "Error fetching events",
      error: error.message,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid event ID format" });
    }
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({
      message: "Event fetched successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching event",
      error: error.message,
    });
  }
};

export const getEventCategories = async (req, res) => {
  try {
    const categories = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({
      message: "Categories fetched successfully",
      data: categories.map((c) => ({ label: c._id, count: c.count })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

export const submitEvent = async (req, res) => {
  try {
    validateEventSubmissionData(req);

    if (req.user.role !== "organizer") {
      return res.status(403).json({
        message: "Only organizers can submit events",
      });
    }

    const event = await Event.create({
      ...req.body,
      organizer: req.body.organizer || req.user.fullName,
      submittedBy: req.user._id,
      status: "pending",
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        submittedEvents: event._id,
      },
    });

    res.status(201).json({
      message: "Event submitted successfully",
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const editEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to edit this event" });
    }

    // Only allow updating certain fields to prevent status override
    const updates = { ...req.body };
    delete updates.status;
    delete updates.submittedBy;

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating event",
      error: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this event" });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Remove from organizer's submittedEvents
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { submittedEvents: req.params.id },
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting event",
      error: error.message,
    });
  }
};

export const getEventParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("participants.user");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to view participants for this event" });
    }

    // Map through the participants and sanitize the user object
    const safeParticipants = event.participants.map(p => {
      // It's possible the user was deleted, so we check if p.user exists
      const user = p.user ? getSafeUserData(p.user) : null;
      return {
        ...user,
        teamName: p.teamName || ""
      };
    }).filter(p => p._id); // Filter out any null users

    res.json({
      message: "Participants fetched successfully",
      data: safeParticipants,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching participants",
      error: error.message,
    });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const { teamName } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.registrationLink) {
      return res.status(400).json({ message: "This event uses an external registration link." });
    }

    const user = await User.findById(req.user._id);

    if (user.registeredEvents.includes(req.params.id)) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    // Add to user's registeredEvents
    user.registeredEvents.push(req.params.id);
    await user.save();

    // Add to event's participants
    event.participants.push({
      user: req.user._id,
      teamName: teamName || ""
    });
    await event.save();

    res.json({
      message: "Successfully registered for the event",
      registeredEvents: user.registeredEvents,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering for event",
      error: error.message,
    });
  }
};
