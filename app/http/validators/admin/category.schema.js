const Joi = require('joi');
const createHttpError = require('http-errors');

const addCategorySchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest('عنوان فارسی دسته بندی صحیح نمی باشد')),
  englishTitle: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(
      createHttpError.BadRequest('عنوان انگلیسی دسته بندی صیحیح نمی باشد')
    ),
});

const updateCategorySchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest('عنوان فارسی دسته بندی صحیح نمیباشد')),
  englishTitle: Joi.string()
    .min(3)
    .max(100)
    .error(
      createHttpError.BadRequest('عنوان انگلیسی دسته بندی صیحیح نمی باشد')
    ),
});

module.exports = {
  addCategorySchema,
  updateCategorySchema,
};
