import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [
      function () {
        return this.authMethods.includes("email");
      },
      "First name is required for email signup",
    ],
    trim: true,
    minlength: 2,
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  profilePic: {
    type: String,
    default: "https://kommodo.ai/i/5l1aQnb0mFPNBofu2XLz",
  },
  emailAuth: {
    password: {
      type: String,
      minLength: [6, "Password must be at least 6 character"],
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    passwordChangedAt: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
  },

  authMethods: {
    type: [String],
    enum: ["email", "oauth"],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  accountStatus: {
    type: String,
    enum: ["pending", "active", "suspended", "deleted"],
    default: "pending",
  },
  preference: {
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    roles: {
      type: [String],
      enum: ["user", "admin", "moderator"],
      default: ["user"],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const User = mongoose.model("User", userSchema);
export default User;

