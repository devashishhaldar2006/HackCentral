import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const filter = { $or: [{ recipient: req.user._id }] };
    
    // Global notifications (like new_event) should only be seen by regular users
    if (req.user.role === "user") {
      filter.$or.push({ recipient: null });
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(15);

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Add user to readBy array if not already there
    if (!notification.readBy.includes(req.user._id)) {
      notification.readBy.push(req.user._id);
      await notification.save();
    }

    res.json({ success: true, message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read", error: error.message });
  }
};
