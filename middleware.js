const {reviewSchema} = require('./joiSchemas.js');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
}

module.exports.isAuthor = async(req, res, next) => {
  const {id} = req.params;
  console.log(id)
  const review = await review.findById(id);
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



