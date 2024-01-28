const createError = require('http-errors');
const Joi = require('joi');
const { MongoIDPattern } = require('../../../../utils/constants');

const addPropertyRequestSchema = Joi.object({
  fullName: Joi.string()
    .required()
    .min(3)
    .max(50)
    .error(createError.BadRequest(' نام صحیح نمی باشد')),
  phoneNumber: Joi.string()
    .required()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(createError.BadRequest('شماره موبایل صحیح نمی باشد')),
  type: Joi.string()
    .required()
    .regex(MongoIDPattern)
    .error(createError.BadRequest(' نوع درخواست صحیح نمی باشد')),
  category: Joi.string()
    .required()
    .regex(MongoIDPattern)
    .error(createError.BadRequest('کاربری مورد نظر  صحیح نمی باشد')),
  location: Joi.string()
    .required()
    .regex(MongoIDPattern)
    .error(createError.BadRequest('منطقه مورد نظر  صحیح نمی باشد')),
  applicantType: Joi.string()
    .required()
    .regex(MongoIDPattern)
    .error(createError.BadRequest('نوع درخواست دهنده مورد نظر  صحیح نمی باشد')),
  meter: Joi.number().error(
    createError.BadRequest('متراژ وارد شده صحیح نمی باشد')
  ),
  rooms: Joi.number().error(
    createError.BadRequest('تعداد اتاق وارد شده صحیح نمی باشد')
  ),
  floors: Joi.number().error(
    createError.BadRequest('تعداد طبقات وارد شده صحیح نمی باشد')
  ),
  floor: Joi.number().error(
    createError.BadRequest('تعداد طبقات وارد شده صحیح نمی باشد')
  ),
  units: Joi.number().error(
    createError.BadRequest('تعداد واحد وارد شده صحیح نمی باشد')
  ),
  propertyAge: Joi.number().error(
    createError.BadRequest('متراژ وارد شده صحیح نمی باشد')
  ),
  budget: Joi.number()
    .required()
    .error(createError.BadRequest('قیمت وارد شده صحیح نمی باشد')),
  isChecked: Joi.boolean().error(
    createError.BadRequest('وضعیت درخواست صحیح نمی باشد')
  ),
  priority: Joi.number().error(
    createError.BadRequest('اولویت بندی درخواست صحیح نمی باشد')
  ),
  description: Joi.string().error(
    createError.BadRequest('توضیحات وارد شده صحیح نمی باشد')
  ),
  region: Joi.string()
    .min(3)
    .max(15)
    .error(createError.BadRequest('منطقه/محله وارد شده صحیح نمی باشد')),
  parking: Joi.boolean().error(
    createError.BadRequest('مقدار پارکینگ صحیح نمی باشد')
  ),
  warehouse: Joi.boolean().error(
    createError.BadRequest('مقدار انباری صحیح نمی باشد')
  ),
  images: Joi.allow(),
});

module.exports = {
  addPropertyRequestSchema,
};
