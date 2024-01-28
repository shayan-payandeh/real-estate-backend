const Controller = require('../../controller');
const { StatusCodes: HttpStatus } = require('http-status-codes');
const createHttpError = require('http-errors');
const {
  addApplicantTypeSchema,
  updateApplicantTypeSchema,
} = require('../../../validators/admin/applicantType.schema');
const { ApplicantTypeModel } = require('../../../../models/applicantType');

class ApplicantTypeContoller extends Controller {
  async getListOfApplicantType(req, res) {
    const query = req.query;
    const applicantTypes = await ApplicantTypeModel.find(query);
    if (!applicantTypes)
      throw createHttpError.ServiceUnavailable(
        'هیچ نوع درخواست دهنده ای یافت نشد'
      );
    return res.status(HttpStatus.OK).json({
      statuCode: HttpStatus.OK,
      data: { applicantTypes },
    });
  }

  async addNewApplicantType(req, res) {
    const { title, englishTitle } = await addApplicantTypeSchema.validateAsync(
      req.body
    );
    await this.findApplicantTypeWithTitle(englishTitle);
    const applicantType = await ApplicantTypeModel.create({
      title,
      englishTitle,
    });

    if (!applicantType) throw createHttpError.InternalServerError('خطای داخلی');
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: 'نوع درخواست دهنده جدید با موفقیت افزوده شد',
      },
    });
  }

  async updateApplicantType(req, res) {
    const { id } = req.params;
    const { title, englishTitle } = req.body;
    await this.checkExistApplicantType(id);
    await updateApplicantTypeSchema.validateAsync(req.body);
    const updateResult = await ApplicantTypeModel.updateOne(
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

  async removeApplicantType(req, res) {
    const { id } = req.params;
    const applicantType = await this.checkExistApplicantType(id);
    const deleteResult = await ApplicantTypeModel.findByIdAndDelete(
      applicantType._id
    );
    if (deleteResult.deletedCount == 0)
      throw createError.InternalServerError('حذف نوع درخواست دهنده انجام نشد');
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: 'حذف  نوع درخواست دهنده با موفقیت انجام شد',
      },
    });
  }

  async getApplicantTypeById(req, res) {
    const { id } = req.params;
    const applicantType = await this.checkExistApplicantType(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        applicantType,
      },
    });
  }

  async findApplicantTypeWithTitle(englishTitle) {
    const applicantType = await ApplicantTypeModel.findOne({ englishTitle });
    if (applicantType)
      throw createHttpError.BadRequest(
        ' نوع درخواست دهنده با این عنوان وجود ندارد.'
      );
  }

  async checkExistApplicantType(id) {
    const applicantType = await ApplicantTypeModel.findById(id);
    if (!applicantType)
      throw createHttpError.BadRequest(
        'نوع درخواست دهنده با این عنوان وجود ندارد.'
      );
    return applicantType;
  }
}

module.exports = {
  ApplicantTypeContoller: new ApplicantTypeContoller(),
};
