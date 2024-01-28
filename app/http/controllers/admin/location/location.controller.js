const Controller = require('../../controller');
const { StatusCodes: HttpStatus } = require('http-status-codes');
const createHttpError = require('http-errors');
const {
  addLocationSchema,
  updateLocationSchema,
} = require('../../../validators/admin/loccation.schema');
const { LocationModel } = require('../../../../models/location');

class LocationContoller extends Controller {
  async getListOfLocations(req, res) {
    const query = req.query;
    const locations = await LocationModel.find(query);
    if (!locations)
      throw createHttpError.ServiceUnavailable('هیچ منطقه ای یافت نشد');
    return res.status(HttpStatus.OK).json({
      statuCode: HttpStatus.OK,
      data: { locations },
    });
  }

  async addNewLocation(req, res) {
    const { title, englishTitle } = await addLocationSchema.validateAsync(
      req.body
    );
    await this.findLocationWithTitle(englishTitle);
    const location = await LocationModel.create({
      title,
      englishTitle,
    });

    if (!location) throw createHttpError.InternalServerError('خطای داخلی');
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: 'منطقه جدید با موفقیت افزوده شد',
      },
    });
  }

  async updateLocation(req, res) {
    const { id } = req.params;
    const { title, englishTitle } = req.body;
    await this.checkExistLocation(id);
    await updateLocationSchema.validateAsync(req.body);
    const updateResult = await LocationModel.updateOne(
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

  async removeLocation(req, res) {
    const { id } = req.params;
    const location = await this.checkExistLocation(id);
    const deleteResult = await LocationModel.findByIdAndDelete(location._id);
    if (deleteResult.deletedCount == 0)
      throw createError.InternalServerError('حذف منطقه انجام نشد');
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: 'حذف  منطقه با موفقیت انجام شد',
      },
    });
  }

  async getLocationById(req, res) {
    const { id } = req.params;
    const location = await this.checkExistLocation(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        location,
      },
    });
  }

  async findLocationWithTitle(englishTitle) {
    const location = await LocationModel.findOne({ englishTitle });
    if (location)
      throw createHttpError.BadRequest(' منطقه با این عنوان وجود ندارد.');
  }

  async checkExistLocation(id) {
    const location = await LocationModel.findById(id);
    if (!location)
      throw createHttpError.BadRequest('منطقه با این عنوان وجود ندارد.');
    return location;
  }
}

module.exports = {
  LocationController: new LocationContoller(),
};
