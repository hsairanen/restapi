const mongoose = require('mongoose');

const predSchema = new mongoose.Schema({
  id: String,
  pred: Number,
  year: Number,
  date: {type: Date, default: Date.now},
  user: {name: String, role: {type: String, default: 'user'}}
});

const predModel = mongoose.model('predictions', predSchema);
module.exports = predModel;
