const express = require('express');
const predictionsDb = require('../model/predictions');
const statModel = require('../statmodel/statmodel');
const router = express.Router();

// ROUTES FOR AN ADMIN

// Get all the predictions
router.get('/', async (req, res) => {
  try {
    const allPredictions = await predictionsDb.find();
    //res.json(allPredictions);
    res.render('index.ejs', {
           allPredictions: allPredictions
    });
  } catch (err) {
    res.status(500).json({msg: 'Server error'});
  }
});

// Update a user's role
router.patch('/', async (req, res) => {

    // Avoid client error
    if(!req.body.role) {
      return res.json({msg: 'Please give a role.'})
    }
    if(!req.body.username) {
      return res.json({msg: 'Please give a username.'})
    }

    try {
      const prediction = await predictionsDb.find({'user.name': req.body.username});

      // If username cannot be found
      if(prediction.length === 0) {
        return res.json({msg: 'Username cannot not be found'});
      }

      await prediction.forEach((pred) => {pred.user.role = req.body.role;
                                          pred.save()});
      res.status(201).json({msg: `User's ${req.body.username} role updated to ${req.body.role}.`});
    }
    catch {
      // Server error
      res.status(500).json({msg: 'Server error'});
    }
});


// ROUTES FOR A USER

// Get the predictions of a user
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

// Delete a prediction
router.delete('/:user/:id', async (req, res) => {
  try {

    const pred = await predictionsDb.findById({_id: req.params.id});

    // Only the user who has made the prediction can delete it.
    if(pred.user.name !== req.params.user || pred.length === 0) {
      return res.json({msg: 'Prediction cannot not be found'});
    }

    // Remove the prediction
    await pred.remove();

    // Return the predictions left
    const allPreds = await predictionsDb.find({user: req.params.user});

    if(allPreds.length === 0) {
      return res.json({msg: 'No predictions left'});
    } else {
      res.json(allPreds);
    }

  } catch (err) {
    res.status(500).json({msg: 'Server error'});
  }
});


module.exports = router;
