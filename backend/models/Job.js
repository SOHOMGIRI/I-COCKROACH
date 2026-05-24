const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Social Media',
      'Branding',
      'Video Editing',
      'Growth Outreach',
      'Automation Tech',
      'Research Ops',
    ],
  },
  budget: {
    type: Number,
    required: true,
    min: 0,
  },
  deadline: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  // ✅ Display name of the poster (optional, for UI)
  postedBy: {
    type: String,
    required: true,
    trim: true,
  },

  // ✅ Actual owner reference (critical for ownership checks)
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Completed', 'Closed'],
    default: 'Open',
  },

}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
