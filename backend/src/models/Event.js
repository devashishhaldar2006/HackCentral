import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (this.startDate && value) return value >= this.startDate;
          return true;
        },
        message: "End date must be greater than or equal to start date",
      },
    },
    location: {
      type: String,
      trim: true,
    },
    venue: {
      type: String,
      trim: true,
      default: null,
    },
    image: {
      type: String,
      match: [/^https?:\/\/.+/i, "Please enter a valid URL"],
    },
    category: {
      type: String,
      enum: [
        "Conference",
        "Hackathon",
        "Workshop",
        "Expo",
        "Meetup",
        "Entertainment",
      ],
      required: true,
    },
    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      required: true,
    },
    price: {
      type: String,
      enum: ["Free", "Paid"],
      default: "Free",
    },
    registrationLink: {
      type: String,
      match: [/^https?:\/\/.+/i, "Please enter a valid URL"],
    },
    organizer: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    source: {
      type: String,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    participants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        teamName: { type: String, default: "" },
        registeredAt: { type: Date, default: Date.now },
      }
    ],
    announcements: [
      {
        message: { type: String, required: true },
        postedAt: { type: Date, default: Date.now }
      }
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Text index for search
eventSchema.index({
  title: "text",
  description: "text",
  tags: "text",
  location: "text",
  organizer: "text",
});

export default mongoose.model("Event", eventSchema);
