const Joi = require('joi');
const createHttpError = require('http-errors');

const addApplicantTypeSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(
      createHttpError.BadRequest('عنوان فارسی نوع درخواست دهنده صحیح نمی باشد')
    ),
  englishTitle: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(
      createHttpError.BadRequest(
        'عنوان انگلیسی نوع درخواست دهنده صیحیح نمی باشد'
      )
    ),
});

const updateApplicantTypeSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .error(
      createHttpError.BadRequest('عنوان فارسی نوع درخواست دهنده صحیح نمیباشد')
    ),
  englishTitle: Joi.string()
    .min(3)
    .max(100)
    .error(
      createHttpError.BadRequest(
        'عنوان انگلیسی نوع درخواست دهنده صیحیح نمی باشد'
      )
    ),
});

module.exports = {
  addApplicantTypeSchema,
  updateApplicantTypeSchema,
};
