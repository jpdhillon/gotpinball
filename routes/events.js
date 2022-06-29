const express = require('express');
const router = express.Router();
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const getRegions = async () => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/regions.json');
    const regions = res.data.regions;
    return regions;
  } catch (e) {
    console.log("Error:", e);
  }
}

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
  const regions = await getRegions();
  const events = await getEvents(req);
  res.render('events/events', { regions, events });
}));

module.exports = router;