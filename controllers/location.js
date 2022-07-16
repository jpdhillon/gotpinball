const axios = require('axios');
const Review = require('../models/review');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });



const fetchLocation = async (req, res) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/locations/' + req.params.id + '.json');
    const location = res.data;
    const address = location.street + ", " + location.city + ", " + location.state + " " + location.zip;
    const geoData = await geocoder.forwardGeocode({
      query: address,
      limit: 1
    }).send()
    location.geometry = geoData.body.features[0].geometry;
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

const fetchReviews = async (req) => {
  try {
    const reviews = await Review.find({locationId: req.params.id}).populate('author');
    return reviews;
  } catch (e) {
    console.log("Error:", e);
  }
}

module.exports.getLocation = async (req, res) => {
  const locationAndMachines = await fetchLocation(req);
  const reviews = await fetchReviews(req);
  if (!locationAndMachines) {
    req.flash('error', 'Cannot find that location!');
    return res.redirect('/');
  }
  const [location, locationMachines] = locationAndMachines;
  res.render('location/location', { location, locationMachines, reviews });
};

module.exports.renderNewReviewForm = (req, res) => {
  const id = req.params.id;
  res.render('location/newReview', { id });
};

module.exports.createReview = async (req, res, next) => {
  const review = new Review(req.body.review);
  review.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  review.author = req.user._id;
  await review.save();
  locationId = req.body.review.locationId;
  req.flash('success', 'Successfully submitted review!');
  res.redirect(`/location/${locationId}`);
};

module.exports.renderEditReviewForm = async (req, res) => {
  const review = await Review.findById(req.params.id);
  res.render('location/editReview', { review });
};

module.exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByIdAndUpdate(id, { ...req.body.review });
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  review.images.push(...imgs);
  await review.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await review.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
  };
  locationId = req.body.review.locationId;
  req.flash('success', 'Successfully edited review!');
  res.redirect(`/location/${locationId}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  await Review.findByIdAndDelete(id);
  locationId = req.body.review.locationId;
  req.flash('success', 'Successfully deleted review!');
  res.redirect(`/location/${locationId}`);
}

