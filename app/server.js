const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const createError = require('http-errors');
const path = require('path');
const { allRoutes } = require('./router/router');
dotenv.config();

class Application {
  app = express();
  PORT = process.env.PORT || 5000;
  DB_URI = process.env.APP_DB;

  constructor() {
    this.createServer();
    this.connectToDB();
    this.configServer();
    this.initClientSession();
    this.configRoutes();
    this.errorHandling();
  }

  createServer() {
    this.app.listen(this.PORT, () =>
      console.log(`listening on port ${this.PORT}`)
    );
  }

  connectToDB() {
    mongoose
      .connect(this.DB_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      })
      .then(() => console.log('MongoDB connected !!'))
      .catch((err) => console.log('Failed to connect to MongoDB', err));
  }

  // allowCrossDomain = (req, res, next) => {
  //   res.header(`Access-Control-Allow-Origin`, '*');
  //   // res.header(`Access-Control-Allow-Origin`, `http://localhost:3000`);
  //   res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  //   res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  //   next();
  // };
  configServer() {
    this.app.use(cors());
    this.app.use((req, res, next) => {
      res.setHeader(
        'Access-Control-Allow-Origin',
        'https://hormozganfile.info'
      );
      // res.setHeader(
      //   'Access-Control-Allow-Methods',
      //   'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE'
      // );
      // res.setHeader(
      //   'Access-Control-Allow-Headers',
      //   'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers'
      // );
      // res.setHeader('Access-Control-Allow-Credentials', true);
      // res.setHeader('Access-Control-Allow-Private-Network', true);
      //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
      // res.setHeader('Access-Control-Max-Age', 7200);

      next();
    });
    // this.app.use(
    //   cors({ credentials: true, origin: process.env.ALLOW_CORS_ORIGIN })
    // );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(`/images`, express.static(`app/uploads`));
  }

  initClientSession() {
    this.app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY));
  }

  configRoutes() {
    this.app.use('', allRoutes);
  }

  errorHandling() {
    this.app.use((req, res, next) => {
      next(createError.NotFound('آدرس مورد نظر یافت نشد'));
    });
    this.app.use((error, req, res, next) => {
      const serverError = createError.InternalServerError();
      const statusCode = error.status || serverError.status;
      const message = error.message || serverError.message;
      return res.status(statusCode).json({
        statusCode,
        message,
      });
    });
  }
}

module.exports = Application;
