import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: [
        "register",
        "bookmark",
        "unbookmark",
        "create_event",
        "profile_update",
      ],
      required: true,
    },
    targetEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true },
);

// Index for efficient heatmap/date-range queries
activityLogSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("ActivityLog", activityLogSchema);
