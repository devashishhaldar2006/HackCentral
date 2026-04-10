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
    },
    category: {
      type: String,
      enum: ["Conference", "Hackathon", "Workshop", "Expo", "Meetup", "Entertainment"],
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
  },
  { timestamps: true },
);

// Text index for search
eventSchema.index({ title: "text", description: "text", tags: "text", location: "text", organizer: "text" });

export default mongoose.model("Event", eventSchema);