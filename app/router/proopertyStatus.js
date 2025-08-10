const router = require('express').Router();
const expressAsyncHandler = require('express-async-handler');
const {
  PropertyStatusController,
} = require('../http/controllers/admin/propertyStatus/propertyStatus.controller');

router.get(
  '/list',
  expressAsyncHandler(PropertyStatusController.getListOfPropertyStatus)
);

router.get(
  '/:id',
  expressAsyncHandler(PropertyStatusController.getPropertyStatusById)
);

module.exports = {
  propertyStatusRoutes: router,
};
