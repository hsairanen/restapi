const express = require('express');
const predictionsDb = require('../model/predictions');
const statModel = require('../statmodel/statmodel');
const router = express.Router();

// Get the prediction
router.get('/:id', async (req, res) => {
  try {
    const pred = await predictionsDb.findById(req.params.id);
    //res.json(pred);
    res.render('edit/edit.ejs', {
           pred
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
