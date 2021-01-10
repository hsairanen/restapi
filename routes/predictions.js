const express = require('express');
const predictionsDb = require('../model/predictions');
const statModel = require('../statmodel/statmodel');
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

// Get the predictions of a user
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

// Create a prediction
router.post('/user/:user', async (req, res) => {

  // Avoid client error
  if (typeof req.body.year !== "number" || req.body.year <= 0 || req.body.year % 1 !== 0) {
    return res.json({msg: 'Year must be a positive integer.'});
  } else if (req.body.year > 0 & req.body.year < 2010) {
    return res.json({msg: 'Cannot predict a year earlier than 2010.'});
  } else if (req.body.year > 2030) {
    return res.json({msg: 'Cannot predict a year later than 2030.'});
  }

  try {
    const pred = new predictionsDb ({
        pred: statModel.polyRegModel(req.body.year),
        year: req.body.year,
        user: req.params.user
      });

    // Store into the database
    const newPred = await pred.save();
    // Return the pred and the year, if an object is successfully created.
    res.status(201).json({pred: newPred.pred, year: newPred.year});
  } catch (err) {
    res.status(500).json({msg: 'Server error'});
  }
});

module.exports = router;
