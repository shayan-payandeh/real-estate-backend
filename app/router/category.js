const router = require('express').Router();
const expressAsyncHandler = require('express-async-handler');
const {
  CategoryController,
} = require('../http/controllers/admin/category/category.contoller');

router.get(
  '/list',
  expressAsyncHandler(CategoryController.getListOfCategories)
);

router.get('/:id', expressAsyncHandler(CategoryController.getCategoryById));

module.exports = {
  categoryRoutes: router,
};
