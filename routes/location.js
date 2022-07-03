const express = require('express');
const router = express.Router();
const location = require('../controllers/location');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateReview } = require('../middleware');

router.get('/:id', catchAsync(location.getLocation));

router.route('/:id/reviews')
  .get(isLoggedIn, location.renderNewReviewForm)
  .post(isLoggedIn, validateReview, catchAsync(location.createReview))

router.get('/:id/reviews/:id/edit', isLoggedIn, isAuthor, catchAsync(location.renderEditReviewForm));

router.route('/:id/reviews/:id')
  .put(isLoggedIn, validateReview, isAuthor, catchAsync(location.updateReview))
  .delete(isLoggedIn, isAuthor, catchAsync(location.deleteReview))

module.exports = router;