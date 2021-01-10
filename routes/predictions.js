const express = require('express');
const predictionsDb = require('../model/predictions');
const router = express.Router();

// Get all the predictions
router.get('/', async (req, res) => {
  try {
    const allPredictions = await predictionsDb.find();
    res.json(allPredictions);
  } catch (err) {
    res.status(500).json({msg: 'Server error'});
  }
});

// Get a single prediction
router.get('/:id', async (req, res) => {
  try {
    const prediction = await predictionsDb.findById(req.params.id);
    res.json(prediction);
  } catch (err) {
    res.status(400).json({msg: 'Invalid ID'});
  }
});

// Get the predictions of the given user
router.get('/user/:user', async (req, res) => {
    try {
      const prediction = await predictionsDb.find({user: req.params.user});
      if (prediction.length === 0) {
        res.json({msg: 'User not found'});
      } else {
        res.json(prediction);
      }
    } catch (err) {
      res.status(500).json({msg: 'Server error'});
    }
});

module.exports = router;
