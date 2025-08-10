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
    .error(createError.BadRequest('نوع درخواست دهنده مورد نظر  صحیح نمی باشد'))
    .error(createError.InternalServerError('نوع درخواست دهنده را انتخاب کنید')),

  propertyStatus: Joi.allow(),

  meter: Joi.number()
    .required()
    .error(createError.BadRequest('متراژ درخواستی صحیح نمی باشد'))
    .error(createError.InternalServerError('متراژ درخواستی را وارد کنید')),

  rooms: Joi.number()
    .error(createError.BadRequest('تعداد اتاق وارد شده صحیح نمی باشد'))
    .error(createError.InternalServerError('تعداد اتاق را وارد کنید.')),
  floors: Joi.number().error(
    createError.BadRequest('تعداد طبقات وارد شده صحیح نمی باشد')
  ),
  floor: Joi.number()
    .error(createError.BadRequest(' طبقه وارد شده صحیح نمی باشد'))
    .error(createError.InternalServerError(' طبقه را وارد کنید.')),
  units: Joi.number().error(
    createError.BadRequest('تعداد واحد وارد شده صحیح نمی باشد')
  ),
  propertyAge: Joi.number()
    .error(createError.BadRequest('سن بنا وارد شده صحیح نمی باشد'))
    .error(createError.BadRequest('سن بنا را وارد کنید')),
  budget: Joi.number()
    .required()
    .error(createError.BadRequest('قیمت وارد شده صحیح نمی باشد'))
    .error(createError.InternalServerError('قیمت (بودجه) را وارد کنید.')),
  isChecked: Joi.boolean().error(
    createError.BadRequest('وضعیت درخواست صحیح نمی باشد')
  ),
  priority: Joi.number().error(
    createError.BadRequest('اولویت بندی درخواست صحیح نمی باشد')
  ),
  address: Joi.string()
    .min(0)
    .error(createError.BadRequest('آدرس وارد شده صحیح نمی باشد')),
  description: Joi.string()
    .min(0)
    .error(createError.BadRequest('توضیحات وارد شده صحیح نمی باشد')),
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
  elevator: Joi.boolean().error(
    createError.BadRequest('مقدار آسانسور صحیح نمی باشد')
  ),
  balcony: Joi.boolean().error(
    createError.BadRequest('مقدار بالکن صحیح نمی باشد')
  ),
  lobby: Joi.boolean().error(
    createError.BadRequest('مقدار لابی صحیح نمی باشد')
  ),
  roofGarden: Joi.boolean().error(
    createError.BadRequest('مقدار روف گاردن صحیح نمی باشد')
  ),
  meetingRoom: Joi.boolean().error(
    createError.BadRequest('مقدار سالن اجتماعات صحیح نمی باشد')
  ),
  gym: Joi.boolean().error(
    createError.BadRequest('مقدار سالن ورزشی صحیح نمی باشد')
  ),
  images: Joi.allow(),
});

module.exports = {
  addPropertyRequestSchema,
};
