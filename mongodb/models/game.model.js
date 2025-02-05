const mongoose = require('mongoose');
const { Schema } = mongoose;

const GameSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  level: [{
    name: { type: String, required: true },
    value: { type: Number, required: true },
  }],
  userLimit: { type: Number, default: 2 },
  questionLimit: { type: Number, default: 4 },
}, { timestamps: true });

module.exports = mongoose.model('game', GameSchema, 'game');