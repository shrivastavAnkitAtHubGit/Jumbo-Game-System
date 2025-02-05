const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSessionStatSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'session', required: true },
  questionsSubmitted: { type: Number, default: 0 },
  correctQuestions: { type: Number, default: 0 },
  totalTimeTaken: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('userSessionStat', UserSessionStatSchema, 'userSessionStat');