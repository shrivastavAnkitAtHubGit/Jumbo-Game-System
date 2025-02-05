const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  gameId: { type: Schema.Types.ObjectId, ref: 'game', required: true },
  level: [{
    name: { type: String, required: true },
    value: { type: Number, required: true },
    _id: false,
  }],
  options: [{
    name: { type: String, required: true },
    value: { type: Number, required: true },
    isCorrect: { type: Boolean, default: false },
    _id: false,
  }],
}, { timestamps: true });

module.exports = mongoose.model('question', QuestionSchema, 'question');