const Joi = require('joi');
const createHttpError = require('http-errors');

const addTypeSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest('عنوان فارسی نوع درخواست صحیح نمی باشد')),
  englishTitle: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(
      createHttpError.BadRequest('عنوان انگلیسی نوع درخواست صیحیح نمی باشد')
    ),
});

const updateTypeSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest('عنوان فارسی نوع درخواست صحیح نمیباشد')),
  englishTitle: Joi.string()
    .min(3)
    .max(100)
    .error(
      createHttpError.BadRequest('عنوان انگلیسی نوع درخواست صیحیح نمی باشد')
    ),
});

module.exports = {
  addTypeSchema,
  updateTypeSchema,
};
