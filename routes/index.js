const express = require('express');
const predictionsDb = require('../model/predictions');
const statModel = require('../statmodel/statmodel');
const router = express.Router();

// Get all the predictions
router.get('/', async (req, res) => {
  try {
    // Sort the result by date
    var mysort = {date: -1};
    const allPredictions = await predictionsDb.find().sort(mysort);

    res.render('index.ejs', {
           allPredictions: allPredictions
    });
  } catch (err) {
    res.status(500).json({msg: 'Server error'});
  }
});

// Create a prediction
router.post('/:user', async (req, res) => {

  // Avoid client error
  if(!req.body.year) {
    return res.json({msg: 'Please give a year.'})
  }

  req.body.year = Number(req.body.year);

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
        'user.name': req.params.user
      });

    // Store into the database
    const newPred = await pred.save();
    // Return the pred and the year, if an object is successfully created.
    // res.status(201).json({pred: newPred.pred, year: newPred.year});
    // Redirect to the home page
    res.redirect('/')
  } catch (err) {
    res.status(500).json({msg: 'Server error'});
  }
});

/*// Get the predictions of a user
router.get('/:user', async (req, res) => {
    try {
      const prediction = await predictionsDb.find({'user.name': req.params.user});
      if (prediction.length === 0) {
        res.json({msg: 'User not found'});
      } else {
        res.json(prediction);
      }
    } catch (err) {
      res.status(500).json({msg: 'Server error'});
    }
});*/

module.exports = router;
