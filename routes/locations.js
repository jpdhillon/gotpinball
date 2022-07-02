const express = require('express');
const router = express.Router();
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const getLocations = async (thisRegion) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/region/' + thisRegion + '/locations.json');
    const locations = res.data.locations;
    return locations;
  } catch (e) {
    console.log("Error:", e);
  }
}

router.get('/:id', catchAsync(async (req, res) => {
  const thisRegion = req.params.id;
  const locations = await getLocations(thisRegion);
  if (!locations) {
    req.flash('error', 'Cannot find that Region!');
    return res.redirect('/');
  }
  res.render('locations/locations', { locations, thisRegion });
}));

module.exports = router;