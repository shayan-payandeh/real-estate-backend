const createError = require("http-errors");
const JWT = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { UserModel } = require("../app/models/user");
const mongoose = require("mongoose");
const moment = require("moment-jalali");
const crypto = require("crypto");

function secretKeyGenerator() {
  return crypto.randomBytes(32).toString("hex").toUpperCase();
}

function generateRandomNumber(length) {
  if (length === 5) {
    return Math.floor(10000 + Math.random() * 90000);
  }
  if (length === 6) {
    return Math.floor(100000 + Math.random() * 900000);
  }
}

function toPersianDigits(n) {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
}

async function setAccessToken(res, user) {
  console.log("access token ...");
  const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 365, // would expire after 1 year
    httpOnly: false, // The cookie only accessible by the web server
    signed: true, // Indicates if the cookie should be signed
    sameSite: "Lax",
    // secure: process.env.NODE_ENV === 'development' ? false : true,
    secure: true,
    domain:
      process.env.NODE_ENV === "production"
        ? "shayan-real-estate.liara.run"
        : "localhost",
  };
  res.cookie(
    "accessToken",
    await generateToken(user, "1y", process.env.ACCESS_TOKEN_SECRET_KEY),
    cookieOptions
  );
}

async function setRefreshToken(res, user) {
  console.log("refresh token ...");

  const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 730, // would expire after 2 years
    httpOnly: true, // The cookie only accessible by the web server
    signed: true, // Indicates if the cookie should be signed
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "development" ? false : true,
    domain:
      process.env.NODE_ENV === "production"
        ? "shayan-real-estate.liara.run"
        : "localhost",
  };
  res.cookie(
    "refreshToken",
    await generateToken(user, "2y", process.env.REFRESH_TOKEN_SECRET_KEY),
    cookieOptions
  );
}

function generateToken(user, expiresIn, secret) {
  return new Promise((resolve, reject) => {
    const payload = {
      _id: user._id,
    };

    const options = {
      expiresIn,
    };

    JWT.sign(
      payload,
      secret || process.env.TOKEN_SECRET_KEY,
      options,
      (err, token) => {
        if (err) reject(createError.InternalServerError("خطای سروری"));
        resolve(token);
      }
    );
  });
}

function verifyRefreshToken(req) {
  const refreshToken = req.signedCookies["refreshToken"];
  if (!refreshToken) {
    throw createError.Unauthorized("لطفا وارد حساب کاربری خود شوید.");
  }
  const token = cookieParser.signedCookie(
    refreshToken,
    process.env.COOKIE_PARSER_SECRET_KEY
  );
  return new Promise((resolve, reject) => {
    JWT.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      async (err, payload) => {
        try {
          if (err)
            reject(createError.Unauthorized("لطفا حساب کاربری خود شوید"));
          const { _id } = payload;
          const user = await UserModel.findById(_id, {
            password: 0,
            otp: 0,
            resetLink: 0,
          });
          if (!user) reject(createError.Unauthorized("حساب کاربری یافت نشد"));
          return resolve(_id);
        } catch (error) {
          reject(createError.Unauthorized("حساب کاربری یافت نشد"));
        }
      }
    );
  });
}

function copyObject(object) {
  return JSON.parse(JSON.stringify(object));
}

function deleteInvalidPropertyInObject(data = {}, blackListFields = []) {
  // let nullishData = ["", " ", "0", 0, null, undefined];
  let nullishData = ["", " ", null, undefined];
  Object.keys(data).forEach((key) => {
    if (blackListFields.includes(key)) delete data[key];
    if (typeof data[key] == "string") data[key] = data[key].trim();
    if (Array.isArray(data[key]) && data[key].length > 0)
      data[key] = data[key].map((item) => item.trim());
    if (Array.isArray(data[key]) && data[key].length == 0) delete data[key];
    if (nullishData.includes(data[key])) delete data[key];
  });
}

async function checkPropertyRequestExist(id) {
  const { ProductModel } = require("../app/models/propertyRequest");
  if (!mongoose.isValidObjectId(id))
    throw createError.BadRequest("شناسه درخواست ارسال شده صحیح نمیباشد");
  const product = await ProductModel.findById(id);
  if (!product) throw createError.NotFound("درخواستی یافت نشد");
  return product;
}

function invoiceNumberGenerator() {
  return (
    moment().format("jYYYYjMMjDDHHmmssSSS") +
    String(process.hrtime()[1]).padStart(9, 0)
  );
}

module.exports = {
  generateRandomNumber,
  toPersianDigits,
  setAccessToken,
  setRefreshToken,
  verifyRefreshToken,
  copyObject,
  deleteInvalidPropertyInObject,
  checkPropertyRequestExist,
  invoiceNumberGenerator,
  secretKeyGenerator,
  generateToken,
};
