const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const createError = require("http-errors");
const { allRoutes } = require("./router/router");
dotenv.config();

class Application {
  app = express();
  PORT = process.env.PORT;
  DB_URI = process.env.APP_DB;
  ROUTE = process.env.NODE_ENV === "production" ? "" : "/api";

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
      .connect(this.DB_URI)
      .then(() => console.log("MongoDB connected !!"))
      .catch((err) => console.log("Failed to connect to MongoDB", err));
  }

  configServer() {
    this.app.use(
      cors({
        credentials: true,
        origin:
          process.env.NODE_ENV === "production"
            ? process.env.ALLOW_CORS_ORIGIN
            : "http://localhost:3000",
        optionsSuccessStatus: 200,
        allowedHeaders: [
          "Content-Type",
          "Origin",
          "X-Requested-With",
          "Accept",
          "x-client-key",
          "x-client-token",
          "x-client-secret",
          "Authorization",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
      })
    );
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(`/images`, express.static(`app/uploads`));
  }

  initClientSession() {
    this.app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY));
  }

  configRoutes() {
    this.app.use(this.ROUTE, allRoutes);
  }

  errorHandling() {
    this.app.use((req, res, next) => {
      next(createError.NotFound("آدرس مورد نظر یافت نشد"));
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
