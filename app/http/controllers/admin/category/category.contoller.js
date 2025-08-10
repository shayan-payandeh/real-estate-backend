const Controller = require('../../controller');
const { StatusCodes: HttpStatus } = require('http-status-codes');
const createHttpError = require('http-errors');
const {
  addCategorySchema,
  updateCategorySchema,
} = require('../../../validators/admin/category.schema');
const { CategoryModel } = require('../../../../models/category');

class CategoryContoller extends Controller {
  async getListOfCategories(req, res) {
    const query = req.query;
    const categories = await CategoryModel.find(query);
    if (!categories)
      throw createHttpError.ServiceUnavailable('کاربری ها  یافت نشد');
    return res.status(HttpStatus.OK).json({
      statuCode: HttpStatus.OK,
      data: { categories },
    });
  }

  async addNewCategory(req, res) {
    const { title, englishTitle } = await addCategorySchema.validateAsync(
      req.body
    );
    await this.findCategoryWithTitle(englishTitle);
    const category = await CategoryModel.create({
      title,
      englishTitle,
    });

    if (!category) throw createHttpError.InternalServerError('خطای داخلی');
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: 'کاربری  جدید با موفقیت افزوده شد',
      },
    });
  }

  async updateCategory(req, res) {
    const { id } = req.params;
    const { title, englishTitle } = req.body;
    await this.checkExistCategory(id);
    await updateCategorySchema.validateAsync(req.body);
    const updateResult = await CategoryModel.updateOne(
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

  async removeCategory(req, res) {
    const { id } = req.params;
    const category = await this.checkExistCategory(id);
    const deleteResult = await CategoryModel.findByIdAndDelete(category._id);
    if (deleteResult.deletedCount == 0)
      throw createError.InternalServerError('حذف کاربری انجام نشد');
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: 'حذف  کاربری با موفقیت انجام شد',
      },
    });
  }

  async getCategoryById(req, res) {
    const { id } = req.params;
    const category = await this.checkExistCategory(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        category,
      },
    });
  }

  async findCategoryWithTitle(englishTitle) {
    const category = await CategoryModel.findOne({ englishTitle });
    if (category)
      throw createHttpError.BadRequest(' کاربری  با این عنوان وجود دارد.');
  }

  async checkExistCategory(id) {
    const category = await CategoryModel.findById(id);
    if (!category)
      throw createHttpError.BadRequest('کاربری با این عنوان وجود ندارد.');
    return category;
  }
}

module.exports = {
  CategoryController: new CategoryContoller(),
};
