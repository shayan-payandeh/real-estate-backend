const Joi = require('joi');
const createHttpError = require('http-errors');

const addPropertyStatusSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest('عنوان فارسی وضعیت ملک صحیح نمی باشد')),
  englishTitle: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(
      createHttpError.BadRequest('عنوان انگلیسی وضعیت ملک صیحیح نمی باشد')
    ),
});

const updatepropertyStatusSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest('عنوان فارسی وضعیت ملک صحیح نمیباشد')),
  englishTitle: Joi.string()
    .min(3)
    .max(100)
    .error(
      createHttpError.BadRequest('عنوان انگلیسی وضعیت ملک صیحیح نمی باشد')
    ),
});

module.exports = {
  addPropertyStatusSchema,
  updatepropertyStatusSchema,
};
