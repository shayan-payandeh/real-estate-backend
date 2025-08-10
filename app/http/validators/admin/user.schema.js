const Joi = require('joi');
const createHttpError = require('http-errors');

const userSchema = Joi.object({
  fullName: Joi.string()
    .min(5)
    .max(100)
    .error(createHttpError.BadRequest('نام وارد شده صحیح نمی باشد')),

  email: Joi.string()
    .email()
    .error(createHttpError.BadRequest('ایمیل وارد شده صحیح نمی باشد')),

  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(createHttpError.BadRequest('شماره موبایل وارد شده صحیح نمی باشد')),

  password: Joi.string()
    .min(6)
    .error(createHttpError.BadRequest('رمز عبور معتبر نمی باشد')),
});

const updateProfileSchema = Joi.object({
  fullName: Joi.string()
    .min(5)
    .max(100)
    .error(createHttpError.BadRequest('نام وارد شده صحیح نمی باشد')),

  email: Joi.string()
    .email()
    .error(createHttpError.BadRequest('ایمیل وارد شده صحیح نمی باشد')),

  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(createHttpError.BadRequest('شماره موبایل وارد شده صحیح نمی باشد')),
});

module.exports = {
  userSchema,
  updateProfileSchema,
};
