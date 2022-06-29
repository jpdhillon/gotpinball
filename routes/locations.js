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
  const regions = await getRegions();
  const thisRegion = req.params.id;
  const locations = await getLocations(thisRegion);
  res.render('locations/locations', { regions, locations, thisRegion });
}));

module.exports = router;