const express = require('express');
const router = express.Router();
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const getEvents = async (req) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/region/' + req.params.id + '/events.json');
    const events = res.data.events;
    return events;
  } catch (e) {
    console.log("Error:", e);
  }
}

router.get('/:id', catchAsync(async (req, res) => {
  const events = await getEvents(req);
  if (!events) {
    req.flash('error', 'Cannot find that Region to Look for Events!');
    return res.redirect('/');
  }
  res.render('events/events', { events });
}));

module.exports = router;