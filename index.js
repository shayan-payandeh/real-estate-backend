// const Application = require('./app/server.js');
// new Application();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const createError = require('http-errors');
const path = require('path');
const { allRoutes } = require('./app/router/router');
dotenv.config();

const app = express();
//set a middleware to parse data
app.use(express.json()); // parses application/json
app.use(express.urlencoded({ extended: true })); // parses application/x-www-form-urlencoded
app.use(`/images`, express.static(`app/uploads`));

// Connect to DB
mongoose
  .connect(process.env.APP_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected!!');
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB', err);
  });

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// //? Router middleware :
// const origin =
//   process.env.NODE_ENV === 'development' ? 'http://localhost:1500' : 'https://';

// app.use(cors({ credentials: true, origin }));
app.use(cors());
app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers, *, Access-Control-Allow-Origin',
    'Origin, X-Requested-with, Content_Type,Accept,Authorization',
    'http://hormozganfile.info'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
    return res.status(200).json({});
  }
  next();
});
app.use(
  cookieParser(process.env.COOKIE_PARSER_SECRET || 'COOKIE PARSER SECRET')
);

app.use((req, res, next) => {
  next(createError.NotFound('آدرس مورد نظر یافت نشد'));
});

app.use('', allRoutes);

app.use((error, req, res, next) => {
  const serverError = createError.InternalServerError();
  const statusCode = error.status || serverError.status;
  const message = error.message || serverError.message;
  return res.status(statusCode).json({
    statusCode,
    message,
  });
});

//? PORT
const port = process.env.PORT || 1500;
app.listen(port, () => console.log(`listening on port ${port}`));
