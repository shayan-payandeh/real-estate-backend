const Controller = require('../../controller');
const { StatusCodes: HttpStatus } = require('http-status-codes');
const mongoose = require('mongoose');
const createHttpError = require('http-errors');
const { CategoryModel } = require('../../../../models/category');
const { LocationModel } = require('../../../../models/location');
const { PropertyRequestModel } = require('../../../../models/propertyRequest');
const {
  addPropertyRequestSchema,
} = require('../../../validators/admin/propertyRequest.schema');
const { TypeModel } = require('../../../../models/type');

class PropertyRequestController extends Controller {
  async addNewPropertyRequest(req, res) {
    await addPropertyRequestSchema.validateAsync(req.body);
    const server =
      process.env.NODE_ENV === 'development'
        ? process.env.LOCAL_SERVER_URL
        : process.env.SERVER_URL;
    const {
      fullName,
      phoneNumber,
      category,
      meter,
      propertyAge,
      propertyStatus,
      budget,
      type,
      description,
      floors,
      floor,
      parking,
      warehouse,
      units,
      location,
      rooms,
      applicantType,
      elevator,
      balcony,
      lobby,
      roofGarden,
      meetingRoom,
      gym,
      address,
    } = req.body;
    let images = req.files?.map((file) => ({
      src: `${server}/images/${file.filename}`,
    }));

    const propertyRequest = await PropertyRequestModel.create({
      fullName,
      applicantType,
      phoneNumber,
      type,
      category,
      meter,
      propertyAge,
      budget,
      rooms,
      floors,
      floor,
      parking,
      warehouse,
      location,
      units,
      description,
      images,
      elevator,
      balcony,
      lobby,
      roofGarden,
      meetingRoom,
      gym,
      address,
      propertyStatus,
    });

    if (!propertyRequest?._id)
      throw createHttpError.InternalServerError('درخواست ثبت نشد');
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { message: 'درخواست با موفقیت ثبت شد', propertyRequest },
    });
  }

  async getListOfPropertyRequests(req, res) {
    let dbQuery = {};
    const {
      search,
      category,
      sort,
      type,
      isChecked,
      page,
      priority,
      location,
      priceMin,
      priceMax,
    } = req.query;

    

    if (location) {
      const locations = location.split(',');
      const locationIds = [];
      for (const item of locations) {
        const { _id } = await LocationModel.findOne({ englishTitle: item });
        locationIds.push(_id);
      }
      dbQuery['location'] = {
        $in: locationIds,
      };
    }

    if (category) {
      const categories = category.split(',');
      const categoryIds = [];
      for (const item of categories) {
        const { _id } = await CategoryModel.findOne({ englishTitle: item });
        categoryIds.push(_id);
      }
      dbQuery['category'] = {
        $in: categoryIds,
      };
    }

    if (type) {
      const types = type.split(',');
      const typeIds = [];
      for (const item of types) {
        const { _id } = await TypeModel.findOne({ englishTitle: item });
        typeIds.push(_id);
      }
      dbQuery['type'] = {
        $in: typeIds,
      };
    }

    let priorityNumbers = { priority: { $in: [1, 2, 3, 4] } };
    priorityNumbers = priority
      ? { priority: parseInt(priority) }
      : { ...priorityNumbers };

    const checking =
      isChecked !== undefined
        ? isChecked === 'true'
          ? { isChecked: true }
          : { isChecked: false }
        : {};

    let priceLimits = priceMin
      ? priceMax
        ? { budget: { $gte: parseInt(priceMin), $lte: parseInt(priceMax) } }
        : { budget: { $gte: parseInt(priceMin) } }
      : {};


      let searchQuery = {}
      if (search) {
          if (mongoose.isValidObjectId(search)) {
              let ids = []
              ids.push(search)
              dbQuery['_id'] = { $in: ids}
            }
           else dbQuery['fullName'] = { $regex: new RegExp(search) };

      }
    const query = {
      ...dbQuery,
      ...checking,
      ...priorityNumbers,
      ...priceLimits,
    };

    const sortQuery = {};
    if (!sort) sortQuery['createdAt'] = -1;
    if (sort) {
      if (sort === 'latest') sortQuery['createdAt'] = -1;
      if (sort === 'earliest') sortQuery['createdAt'] = 1;
      if (sort === 'largest') sortQuery['meter'] = -1;
      if (sort === 'smallest') sortQuery['meter'] = 1;
      if (sort === 'expensive') sortQuery['budget'] = -1;
      if (sort === 'cheapest') sortQuery['budget'] = 1;
    }

    const options = {
      populate: [
        { path: 'category', select: { title: 1, englishTitle: 1 } },
        { path: 'type', select: { title: 1, englishTitle: 1 } },
        { path: 'applicantType', select: { title: 1, englishTitle: 1 } },
        // { path: 'location', select: { title: 1, englishTitle: 1 } },
      ],
      limit: page === 'all' ? 1000000000 : 8,
      page: parseInt(page) || 1,
      lean: true,
      sort: sortQuery,
    };

    const propertyRequests = await PropertyRequestModel.paginate(
      query,
      options
    );

    // .populate('category', 'title englishTitle')
    // .sort(sortQuery);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        propertyRequests: propertyRequests,
      },
    });
  }

  async getPropertyRequestById(req, res) {
    const { id: propertyRequestId } = req.params;
    await this.findPropertyRequestById(propertyRequestId);
    const propertyRequest = await PropertyRequestModel.findById(
      propertyRequestId
    ).populate([
      {
        path: 'category',
        model: 'Category',
        select: {
          title: 1,
          englishTitle: 1,
        },
      },
      {
        path: 'applicantType',
        model: 'ApplicantType',
        select: {
          title: 1,
          englishTitle: 1,
        },
      },
      {
        path: 'location',
        model: 'Location',
        select: {
          title: 1,
          englishTitle: 1,
        },
      },
      {
        path: 'type',
        model: 'Type',
        select: {
          title: 1,
          englishTitle: 1,
        },
      },
      {
        path: 'propertyStatus',
        model: 'PropertyStatus',
        select: {
          title: 1,
          englishTitle: 1,
        },
      },
    ]);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        propertyRequest,
      },
    });
  }

  async removePropertyRequest(req, res) {
    const { id } = req.params;
    await this.findPropertyRequestById(id);
    const deleteResult = await PropertyRequestModel.deleteOne({ _id: id });
    if (deleteResult.deletedCount == 0)
      throw createError.InternalServerError('حدف درخواست انجام نشد');
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: 'حذف درخواست با موفقیت انجام شد',
      },
    });
  }

  async updatePropertyRequest(req, res) {
    const { id } = req.params;
    await this.findPropertyRequestById(id);
    const data = JSON.parse(JSON.stringify(req.body));
    const updatePropertyRequestResult = await PropertyRequestModel.updateOne(
      { _id: id },
      {
        $set: data,
      }
    );
    if (!updatePropertyRequestResult.modifiedCount)
      throw new createHttpError.InternalServerError(
        'به روزرسانی درخواست انجام نشد'
      );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: 'به روزرسانی درخواست با موفقیت انجام شد',
      },
    });
  }

  async findPropertyRequestById(id) {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError.BadRequest('شناسه درخواست ارسال شده صحیح نمیباشد');
    const propertyRequest = await PropertyRequestModel.findById(id);
    if (!propertyRequest) throw createHttpError.NotFound('درخواستی یافت نشد.');
    return propertyRequest;
  }
}

module.exports = {
  PropertyRequestController: new PropertyRequestController(),
};
