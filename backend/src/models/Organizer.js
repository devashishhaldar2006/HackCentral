import mongoose from "mongoose";

const organizerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    website: String,

    verified: {
      type: Boolean,
      default: false,
    },

    submittedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Organizer", organizerSchema);
