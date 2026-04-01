const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { dataDB } = require('../config/db');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: function() { return !this.googleId; }, // not required if user logs in via Google
      minlength: 6,
      select: false, // Don't return password by default
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true // allows multiple users with null googleId
    },
    role: {
      type: String,
      enum: ['user', 'agent', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: 'default-agent.png'
    },
    bio: {
      type: String,
      default: ''
    },
    experience: {
      type: Number,
      default: 0
    },
    happyClients: {
      type: Number,
      default: 0
    },
    phone: {
      type: String,
      default: ''
    },
    profileCompleted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = dataDB.model('User', userSchema);
