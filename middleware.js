const {reviewSchema} = require('./joiSchemas.js');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
}

module.exports.isAuthor = async(req, res, next) => {
  const {locationId, id} = req.params;
  const review = await Review.findById(id);
  if(!review.author.equals(req.user._id)) {
    req.flash('error', "You don't have permission");
    return res.redirect('/:id');
  }
  next();
}

module.exports.validateReview = (res, req, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

module.exports.isRated = (req, res, next) => {
  if(req.body.review.rating == '0') {
    const locationId = req.body.review.locationId;
    const id = req.body.review._id;
    if(req.method === 'POST'){
      req.flash('error', 'You must enter rating before submitting review');
      return res.redirect(`/location/${locationId}/reviews`);
    } else {
      req.flash('error', 'You must enter rating before updating review');
      return res.redirect(`/location/${locationId}/reviews/${id}/edit`);
    }
  } else {
    next();
  }
}


