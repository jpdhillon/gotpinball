const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const axios = require('axios');
const ejsMate = require('ejs-mate');
const Review = require('./models/review');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {reviewSchema} = require('./joiSchemas.js');

mongoose.connect('mongodb://localhost:27017/gotPinball', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const validateReview = (res, req, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

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

const getEvents = async (req) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/region/' + req.params.id + '/events.json');
    const events = res.data.events;
    return events;
  } catch (e) {
    console.log("Error:", e);
  }
}

const getLinks = async (req) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/region/' + req.params.id + '/region_link_xrefs.json');
    const links = res.data.regionlinks;
    return links;
  } catch (e) {
    console.log("Error:", e);
  }
}

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

const getMachineLocations = async (machineId) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/locations.json?by_machine_id=' + machineId + '&no_details=0');
    const machineLocations = res.data.locations;
    return machineLocations;
  } catch (e) {
    console.log("Error:", e);
  }
};

const getReviews = async (req) => {
  try {
    const reviews = await Review.find({locationId: req.params.id});
    return reviews;
  } catch (e) {
    console.log("Error:", e);
  }
}

app.get('/', catchAsync(async (req, res) => {
  const regions = await getRegions();
  res.render('home/home', { regions });
}));

app.get('/locations/:id', catchAsync(async (req, res) => {
  const regions = await getRegions();
  const thisRegion = req.params.id;
  const locations = await getLocations(thisRegion);
  res.render('locations/locations', { regions, locations, thisRegion });
}));

app.get('/location/:id', catchAsync(async (req, res) => {
  const regions = await getRegions();
  const locationAndMachines = await getLocation(req);
  const reviews = await getReviews(req);
  const [location, locationMachines] = locationAndMachines;
  res.render('locations/location', { regions, location, locationMachines, reviews });
}));

app.post('/location/:id/reviews', validateReview, catchAsync(async (req, res) => {
  const review = new Review(req.body.review);
  await review.save();
  locationId = req.body.review.locationId;
  res.redirect(`/location/${locationId}`);
}));

app.get('/location/:id/reviews/:id/edit', catchAsync(async (req, res) => {
  const regions = await getRegions();
  const review = await Review.findById(req.params.id);
  res.render('locations/editReview', { regions, review });
}));

app.put('/location/:id/reviews/:id', validateReview, catchAsync(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByIdAndUpdate(id, { ...req.body.review });
  locationId = req.body.review.locationId;
  res.redirect(`/location/${locationId}`);
}));

app.delete('/location/:id/reviews/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Review.findByIdAndDelete(id);
  locationId = req.body.review.locationId;
  res.redirect(`/location/${locationId}`);
}));

app.get('/events/:id', catchAsync(async (req, res) => {
  const regions = await getRegions();
  const events = await getEvents(req);
  res.render('events/events', { regions, events });
}));

app.get('/links/:id', catchAsync(async (req, res) => {
  const regions = await getRegions();
  const links = await getLinks(req);
  res.render('links/links', { regions, links });
}));

app.get('/machines/:page', catchAsync(async (req, res) => {
  const regions = await getRegions();
  // Declaring variable
  const resPerPage = 100; // results per page
  const page = req.params.page || 1; // page number
  const skip = (resPerPage * page) - resPerPage; // value
  const limit = resPerPage; // limit value
  const machines = await getMachines(); // all machines results from API
  const totalMachines = machines.length;
  const machinesPerPage = machines.slice(skip, (skip+limit)); // the results per page
  res.render('machines/machines', { 
    regions: regions, 
    machinesPerPage: machinesPerPage,
    currentPage: page,
    pages: Math.ceil(totalMachines / resPerPage)
   });
}));

app.get('/machine/:id', catchAsync(async (req, res) => {
  const regions = await getRegions();
  const machineId = req.params.id;
  const machineLocations = await getMachineLocations(machineId);
  res.render('machines/machineLocations', {regions, machineLocations});
}));

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
});

app.use(async (err, req, res, next) => {
  const regions = await getRegions();
  const { statusCode = 500 } = err;
  if (!err.message) {err.message = 'Oh No, Something Went Wrong!'};
  res.status(statusCode).render('error', { regions, err });
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
})