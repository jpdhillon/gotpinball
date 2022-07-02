const express = require('express');
const router = express.Router();
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const getMachines = async () => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/machines.json');
    const machines = res.data.machines;
    machines.sort((a, b) => a.name.localeCompare(b.name));
    return machines;
  } catch (e) {
    console.log("Error:", e);
  }
}

router.get('/:page', catchAsync(async (req, res) => {
  // Declaring variable
  const resPerPage = 100; // results per page
  const page = req.params.page || 1; // page number
  const skip = (resPerPage * page) - resPerPage; // value
  const limit = resPerPage; // limit value
  const machines = await getMachines(); // all machines results from API
  const totalMachines = machines.length;
  const machinesPerPage = machines.slice(skip, (skip+limit)); // the results per page
  res.render('machines/machines', { 
    machinesPerPage: machinesPerPage,
    currentPage: page,
    pages: Math.ceil(totalMachines / resPerPage)
   });
}));

module.exports = router;