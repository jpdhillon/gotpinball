const express = require('express');
const router = express.Router();
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


const getMachineLocations = async (machineId) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/locations.json?by_machine_id=' + machineId + '&no_details=0');
    const machineLocations = res.data.locations;
    return machineLocations;
  } catch (e) {
    console.log("Error:", e);
  }
};

router.get('/:id', catchAsync(async (req, res) => {
  const machineId = req.params.id;
  const machineLocations = await getMachineLocations(machineId);
  res.render('machine/machineLocations', { machineLocations });
}));

module.exports = router;