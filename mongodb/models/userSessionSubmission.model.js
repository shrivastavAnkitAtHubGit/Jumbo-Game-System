const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSessionSubmissionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'session', required: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'question', required: true },
  selectedOption: {
    name: { type: String, required: true },
    value: { type: Number, required: true },
    _id: false,
  },
  isCorrect: { type: Boolean, default: false },
  timeTaken: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('userSessionSubmission', UserSessionSubmissionSchema, 'userSessionSubmission');