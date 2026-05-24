import mongoose from "mongoose";

const securitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    lastLogin: Date,

    lastLoginIP: String,

    loginHistory: [{
        timestamp: {
            type: Date, 
            dafault: Date.now
        },
        ip: String,
        userAgent: String,
    }],

    loginAttempts: {
        type: Number,
        default: 0
    },

    lockUntil : Date,

    
});