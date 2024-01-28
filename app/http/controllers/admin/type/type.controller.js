const Controller = require('../../controller');
const { StatusCodes: HttpStatus } = require('http-status-codes');
const createHttpError = require('http-errors');
const {
  addTypeSchema,
  updateTypeSchema,
} = require('../../../validators/admin/type.schema');
const { TypeModel } = require('../../../../models/type');

class TypeContoller extends Controller {
  async getListOfTypes(req, res) {
    const query = req.query;
    const types = await TypeModel.find(query);
    if (!types)
      throw createHttpError.ServiceUnavailable('نوع درخواست ها  یافت نشد');
    return res.status(HttpStatus.OK).json({
      statuCode: HttpStatus.OK,
      data: { types },
    });
  }

  async addNewType(req, res) {
    const { title, englishTitle } = await addTypeSchema.validateAsync(req.body);
    await this.findTypeWithTitle(englishTitle);
    const type = await TypeModel.create({
      title,
      englishTitle,
    });

    if (!type) throw createHttpError.InternalServerError('خطای داخلی');
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: 'نوع درخواست  جدید با موفقیت افزوده شد',
      },
    });
  }

  async updateType(req, res) {
    const { id } = req.params;
    const { title, englishTitle } = req.body;
    await this.checkExistType(id);
    await updateTypeSchema.validateAsync(req.body);
    const updateResult = await TypeModel.updateOne(
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

  async removeType(req, res) {
    const { id } = req.params;
    const type = await this.checkExistType(id);
    const deleteResult = await TypeModel.findByIdAndDelete(type._id);
    if (deleteResult.deletedCount == 0)
      throw createError.InternalServerError('حذف نوع درخواست انجام نشد');
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: 'حذف  نوع درخواست با موفقیت انجام شد',
      },
    });
  }

  async getTypeById(req, res) {
    const { id } = req.params;
    const type = await this.checkExistType(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        type,
      },
    });
  }

  async findTypeWithTitle(englishTitle) {
    const type = await TypeModel.findOne({ englishTitle });
    if (type)
      throw createHttpError.BadRequest(' نوع درخواست  با این عنوان وجود دارد.');
  }

  async checkExistType(id) {
    const type = await TypeModel.findById(id);
    if (!type)
      throw createHttpError.BadRequest('نوع درخواست با این عنوان وجود ندارد.');
    return type;
  }
}

module.exports = {
  TypeController: new TypeContoller(),
};
