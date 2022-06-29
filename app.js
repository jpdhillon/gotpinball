const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const axios = require('axios');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');

const locationsRoutes = require('./routes/locations');
const locationRoutes = require('./routes/location');
const eventsRoutes = require('./routes/events');
const linksRoutes = require('./routes/links');
const machinesRoutes = require('./routes/machines');
const machineRoutes = require('./routes/machine');

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

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

app.use(session(sessionConfig));

app.use('/locations', locationsRoutes);
app.use('/location', locationRoutes);
app.use('/events', eventsRoutes);
app.use('/links', linksRoutes);
app.use('/machines', machinesRoutes);
app.use('/machine', machineRoutes);

const getRegions = async () => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/regions.json');
    const regions = res.data.regions;
    return regions;
  } catch (e) {
    console.log("Error:", e);
  }
}

app.get('/', catchAsync(async (req, res) => {
  const regions = await getRegions();
  res.render('home/home', { regions });
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