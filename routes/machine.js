const express = require('express');
const router = express.Router();
const machine = require('../controllers/machine');
const catchAsync = require('../utils/catchAsync');

router.get('/:id', catchAsync(machine.getMachineLocations));

module.exports = router;