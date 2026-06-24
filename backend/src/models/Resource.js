import mongoose from "mongoose";
const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    domain: {
      type: String,
      required: true,
      enum: [
        "AI",
        "Healthcare",
        "Fintech",
        "Cybersecurity",
        "Web Development",
        "Blockchain",
        "Education",
        "Agriculture",
        "Climate Tech",
        "Smart Cities",
      ],
    },

    type: {
      type: String,
      required: true,
      enum: [
        "API",
        "Dataset",
        "Template",
        "Repository",
        "Learning",
        "Tool",
      ],
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: null,
    },

    provider: {
      type: String,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    difficulty: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
      ],
      default: "Beginner",
    },

    pricing: {
      type: String,
      enum: [
        "Free",
        "Paid",
      ],
      default: "Free",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    verified: {
      type: Boolean,
      default: true,
    },

    clicks: {
      type: Number,
      default: 0,
    },

    bookmarks: {
      type: Number,
      default: 0,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

resourceSchema.index({
  title: "text",
  description: "text",
  tags: "text",
  provider: "text",
});

export default mongoose.model("Resource", resourceSchema);