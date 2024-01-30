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
    // this.app.use(
    //   cors({
    //     origin: '*', // use your actual domain name (or localhost), using * is not recommended
    //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    //     allowedHeaders: [
    //       'Content-Type',
    //       'Origin',
    //       'X-Requested-With',
    //       'Accept',
    //       'x-client-key',
    //       'x-client-token',
    //       'x-client-secret',
    //       'Authorization',
    //     ],
    //     credentials: true,
    //   })
    // );

    this.app.use(
      cors({
        credentials: true,
        origin: 'http://hormozganfile.info',
        optionsSuccessStatus: 200,
        allowedHeaders: [
          '*',
          'Content-Type',
          'Origin',
          'X-Requested-With',
          'Accept',
          'x-client-key',
          'x-client-token',
          'x-client-secret',
          'Authorization',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        exposedHeaders,
      })
    );
    this.app.options('*', cors());
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
      console.log(res);
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
