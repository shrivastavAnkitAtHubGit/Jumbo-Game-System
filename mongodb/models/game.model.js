const mongoose = require('mongoose');
const { Schema } = mongoose;
const { DEFAULT_GAME_QUESTION_LIMIT, DEFAULT_GAME_USER_LIMIT } = require('../../utils/constants');

const GameSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  level: [{
    name: { type: String, required: true },
    value: { type: Number, required: true },
  }],
  userLimit: { type: Number, default: DEFAULT_GAME_USER_LIMIT },
  questionLimit: { type: Number, default: DEFAULT_GAME_QUESTION_LIMIT },
}, { timestamps: true });

module.exports = mongoose.model('game', GameSchema, 'game');