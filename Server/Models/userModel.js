import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
    oauthAuth: {
      provider: {
        type: String,
        enum: ["google", "github", "facebook"], // Add more as needed
        default: null,
      },
      providerId: {
        type: String, // Unique ID from OAuth provider
      },
      accessToken: {
        type: String,
        select: false,
      },
      refreshToken: {
        type: String,
        select: false,
      },
      tokenExpires: Date,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.index({ email: 1 });
userSchema.index({ "oauthAuth.providerId": 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ "emailAuth.emailVerificationToken": 1 });

// Hash password before saving (email auth only)
userSchema.pre('save', async function(next) {
  // Only hash if password is new or modified
  if (!this.isModified('emailAuth.password')) return next();
 
  try {
    const salt = await bcrypt.genSalt(10);
    this.emailAuth.password = await bcrypt.hash(this.emailAuth.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
 
// Remove sensitive fields before returning
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.emailAuth.password;
  delete userObject.emailAuth.emailVerificationToken;
  delete userObject.emailAuth.passwordResetToken;
  delete userObject.oauthAuth.accessToken;
  delete userObject.oauthAuth.refreshToken;
  delete userObject.twoFactorSecret;
  return userObject;
};

 
// Compare password for email auth
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.emailAuth.password);
};
 
// Check if account is locked due to failed login attempts
userSchema.methods.isLocked = function() {
  return this.emailAuth.lockUntil && this.emailAuth.lockUntil > Date.now();
};
 
// Increment login attempts
userSchema.methods.incLoginAttempts = async function() {
  // Reset if lock has expired
  if (this.emailAuth.lockUntil && this.emailAuth.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { 'emailAuth.loginAttempts': 1 },
      $unset: { 'emailAuth.lockUntil': 1 },
    });
  }
 
  // Increment login attempts
  const updates = { $inc: { 'emailAuth.loginAttempts': 1 } };
 
  // Lock account after 5 failed attempts for 2 hours
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000;
 
  if (this.emailAuth.loginAttempts + 1 >= maxAttempts) {
    updates.$set = { 'emailAuth.lockUntil': new Date(Date.now() + lockTime) };
  }
 
  return await this.updateOne(updates);
};
 
// Reset login attempts on successful login
userSchema.methods.resetLoginAttempts = async function() {
  return await this.updateOne({
    $set: { 'emailAuth.loginAttempts': 0 },
    $unset: { 'emailAuth.lockUntil': 1 },
  });
};
 
// Update last login info
userSchema.methods.updateLastLogin = async function(ip, userAgent) {
  const loginRecord = {
    timestamp: new Date(),
    ip,
    userAgent,
  };
 
  return await this.updateOne({
    $set: { lastLogin: new Date(), lastLoginIP: ip },
    $push: { loginHistory: { $each: [loginRecord], $slice: -20 } }, // Keep last 20 logins
  });
};
 
// Check if email is verified
userSchema.methods.isEmailVerified = function() {
  return this.emailAuth.isEmailVerified === true;
};
 
 
// Find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};
 
// Find user by OAuth provider
userSchema.statics.findByOAuth = function(provider, providerId) {
  return this.findOne({
    'oauthAuth.provider': provider,
    'oauthAuth.providerId': providerId,
  });
};
 
// Find active users only
userSchema.statics.findActive = function() {
  return this.find({ isActive: true, accountStatus: 'active' });
};
 
 
// Generate full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

const User = mongoose.model("User", userSchema);
export default User;
