import Event from "../models/Event.js";
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

    // Full-text search
    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
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
