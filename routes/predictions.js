const express = require('express');
const predictionsDb = require('../model/predictions');
const router = express.Router();

// Get all
router.get('/', async (req, res) => {
  const allPredictions = await predictionsDb.find();
  res.json(allPredictions);
});

module.exports = router;
