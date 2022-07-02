const express = require('express');
const router = express.Router();
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../joiSchemas.js');
const Review = require('../models/review');
const { isLoggedIn } = require('../middleware');


const validateReview = (res, req, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

const getLocation = async (req, res) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/locations/' + req.params.id + '.json');
    const location = res.data;
    const res2 = await axios.get('https://pinballmap.com/api/v1/locations/' + req.params.id + '/machine_details.json');
    const locationMachines = res2.data.machines;
    const res3 = await axios.get('https://pinballmap.com/api/v1/machines.json');
    const machines = res3.data.machines;
    for (var i = 0; i < locationMachines.length; i++) {
      for (var k = 0; k < machines.length; k++) {
        if (locationMachines[i].opdb_id == machines[k].opdb_id) {
          locationMachines[i].opdb_img = machines[k].opdb_img;
        }
      }
    }
    const locationAndMachines = [location, locationMachines];
    return locationAndMachines;
  } catch (e) {
    console.log("Error:", e);
  }
}

const getReviews = async (req) => {
  try {
    const reviews = await Review.find({locationId: req.params.id}).populate('author');
    return reviews;
  } catch (e) {
    console.log("Error:", e);
  }
}

router.get('/:id', catchAsync(async (req, res) => {
  const locationAndMachines = await getLocation(req);
  const reviews = await getReviews(req);
  if (!locationAndMachines) {
    req.flash('error', 'Cannot find that location!');
    return res.redirect('/');
  }
  const [location, locationMachines] = locationAndMachines;
  res.render('location/location', { location, locationMachines, reviews });
}));

router.get('/:id/reviews', isLoggedIn, (req, res) => {
  const id = req.params.id;
  res.render('location/newReview', { id });
});

router.post('/:id/reviews', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
  const review = new Review(req.body.review);
  review.author = req.user._id;
  await review.save();
  locationId = req.body.review.locationId;
  req.flash('success', 'Successfully submitted review!');
  res.redirect(`/location/${locationId}`);
}));

router.get('/:id/reviews/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
  const review = await Review.findById(req.params.id);
  res.render('location/editReview', { review });
}));

router.put('/:id/reviews/:id', isLoggedIn, validateReview, catchAsync(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByIdAndUpdate(id, { ...req.body.review });
  locationId = req.body.review.locationId;
  req.flash('success', 'Successfully edited review!');
  res.redirect(`/location/${locationId}`);
}));

router.delete('/:id/reviews/:id', isLoggedIn, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Review.findByIdAndDelete(id);
  locationId = req.body.review.locationId;
  req.flash('success', 'Successfully deleted review!');
  res.redirect(`/location/${locationId}`);
}));

module.exports = router;