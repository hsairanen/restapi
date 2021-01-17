const mongoose = require('mongoose');

const predSchema = new mongoose.Schema({
  id: String,
  pred: Number,
  year: Number,
  date: {type: Date, default: Date.now},
  user: {name: String, comment: {type: String, default: "Okay"}}
});

const predModel = mongoose.model('predictions', predSchema);
module.exports = predModel;
