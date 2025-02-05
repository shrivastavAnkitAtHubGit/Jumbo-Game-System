const mongoose = require('mongoose');
const { Schema } = mongoose;
const { SESSION_STATUS } = require('../../utils/constants');

const SessionSchema = new Schema({
  name: { type: String, default: '' },
  gameId: { type: Schema.Types.ObjectId, ref: 'game', required: true, },
  level: {
    name: { type: String },
    value: { type: Number },
    _id: false,
  },
  questions: [{
    type: Schema.Types.ObjectId, ref: 'question', required: true,
  }],
  users: [{
    id: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String },
    _id: false,
  }],
  currentQuestionIndex: { type: Number, default: 0 },
  status: { type: String, enum: Object.values(SESSION_STATUS) },
  winner: {
    id: { type: Schema.Types.ObjectId, ref: 'user' },
    name: { type: String },
    _id: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('session', SessionSchema, 'session');