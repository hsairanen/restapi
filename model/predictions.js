const mongoose = require('mongoose');

const predSchema = new mongoose.Schema({
  id: String,
  pred: Number,
  year: Number,
  user: String,
  date: {type: Date, default: Date.now}
});

const predModel = mongoose.model('predictions', predSchema);
module.exports = predModel;
