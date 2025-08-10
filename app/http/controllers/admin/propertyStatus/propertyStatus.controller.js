const Controller = require('../../controller');
const { StatusCodes: HttpStatus } = require('http-status-codes');
const createHttpError = require('http-errors');
const {
  addPropertyStatusSchema,
  updatepropertyStatusSchema,
} = require('../../../validators/admin/propertyStatus.schema');
const { PropertyStatusModel } = require('../../../../models/propertyStatus');

class PropertyStatusContoller extends Controller {
  async getListOfPropertyStatus(req, res) {
    const query = req.query;
    const propertyStatus = (await PropertyStatusModel.find(query)).filter(
      (item) => item.englishTitle !== 'unknown'
    );
    if (!propertyStatus)
      throw createHttpError.ServiceUnavailable(' وضعیت ها  یافت نشد');
    return res.status(HttpStatus.OK).json({
      statuCode: HttpStatus.OK,
      data: { propertyStatus },
    });
  }

  async addNewPropertyStatus(req, res) {
    const { title, englishTitle } = await addPropertyStatusSchema.validateAsync(
      req.body
    );
    await this.findPropertyStatusWithTitle(englishTitle);
    const propertyStatus = await PropertyStatusModel.create({
      title,
      englishTitle,
    });

    if (!propertyStatus)
      throw createHttpError.InternalServerError('خطای داخلی');
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: 'وضعیت  جدید با موفقیت افزوده شد',
      },
    });
  }

  async updatePropertyStatus(req, res) {
    const { id } = req.params;
    const { title, englishTitle } = req.body;
    await this.checkExistPropertyStatus(id);
    await updateCategorySchema.validateAsync(req.body);
    const updateResult = await PropertyStatusModel.updateOne(
      { _id: id },
      {
        $set: { title, englishTitle },
      }
    );
    if (updateResult.modifiedCount == 0)
      throw createError.InternalServerError('به روزرسانی انجام نشد');
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: 'به روز رسانی با موفقیت انجام شد',
      },
    });
  }

  async removePropertyStatus(req, res) {
    const { id } = req.params;
    const propertyStatus = await this.checkExistPropertyStatus(id);
    const deleteResult = await PropertyStatusModel.findByIdAndDelete(
      propertyStatus._id
    );
    if (deleteResult.deletedCount == 0)
      throw createError.InternalServerError('حذف وضعیت انجام نشد');
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: 'حذف  وضعیت با موفقیت انجام شد',
      },
    });
  }

  async getPropertyStatusById(req, res) {
    const { id } = req.params;
    const propertyStatus = await this.checkExistPropertyStatus(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        propertyStatus,
      },
    });
  }

  async findPropertyStatusWithTitle(englishTitle) {
    const propertyStatus = await PropertyStatusModel.findOne({ englishTitle });
    if (propertyStatus)
      throw createHttpError.BadRequest(' وضعیت  با این عنوان وجود دارد.');
  }

  async checkExistPropertyStatus(id) {
    const propertyStatus = await PropertyStatusModel.findById(id);
    if (!propertyStatus)
      throw createHttpError.BadRequest('وضعیت با این عنوان وجود ندارد.');
    return propertyStatus;
  }
}

module.exports = {
  PropertyStatusController: new PropertyStatusContoller(),
};
