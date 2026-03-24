import mongoose from "mongoose";
import validator from "validator";
const userSchema = new mongoose.Schema(
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
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    gender:{
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message:"{VALUE} is not supported"
      }
    },
    avatar: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=1480",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },

    college: {
      type: String,
      trim: true,
      maxlength: 50,
      lowercase: true,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 50,
      lowercase: true,
    },

    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },

    github: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
    linkedin: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },

    role: {
      type: String,
      enum: ["user", "organizer"],
      default: "user",
    },

    bookmarkedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    registeredEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
