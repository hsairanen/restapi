const mongoose = require('mongoose');

const predSchema = new mongoose.Schema({
  pred_id: Number,
  pred: Number,
  year: Number,
  user: String,
  date: Date.now
});

const predModel = mongoose.model('predictions', predSchema);
module.exports = predModel;
