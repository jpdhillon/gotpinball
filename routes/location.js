const express = require('express');
const router = express.Router();
const location = require('../controllers/location');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateReview } = require('../middleware');

router.get('/:id', catchAsync(location.getLocation));

router.get('/:id/reviews', isLoggedIn, location.renderNewReviewForm);

router.post('/:id/reviews', isLoggedIn, validateReview, catchAsync(location.createReview));

router.get('/:id/reviews/:id/edit', isLoggedIn, isAuthor, catchAsync(location.renderEditReviewForm));

router.put('/:id/reviews/:id', isLoggedIn, validateReview, isAuthor, catchAsync(location.updateReview));

router.delete('/:id/reviews/:id', isLoggedIn, isAuthor, catchAsync(location.deleteReview));

module.exports = router;