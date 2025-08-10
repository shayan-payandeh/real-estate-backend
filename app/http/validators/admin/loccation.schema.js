const Joi = require('joi');
const createHttpError = require('http-errors');

const addLocationSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest('عنوان فارسی منطقه صحیح نمی باشد')),
  englishTitle: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest('عنوان انگلیسی منطقه صیحیح نمی باشد')),
});

const updateLocationSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest('عنوان فارسی منطقه صحیح نمیباشد')),
  englishTitle: Joi.string()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest('عنوان انگلیسی منطقه صیحیح نمی باشد')),
});

module.exports = {
  addLocationSchema,
  updateLocationSchema,
};
