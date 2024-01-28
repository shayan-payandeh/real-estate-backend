const router = require('express').Router();
const expressAsyncHandler = require('express-async-handler');
const {
  PropertyRequestController,
} = require('../../http/controllers/admin/propertyRequest/propertyRequest.controller');

// router.get(
//   '/list',
//   expressAsyncHandler(PropertyRequestController.getListOfPropertyRequests)
// );

router.patch(
  '/update/:id',
  expressAsyncHandler(PropertyRequestController.updatePropertyRequest)
);

router.delete(
  '/remove/:id',
  expressAsyncHandler(PropertyRequestController.removePropertyRequest)
);

module.exports = {
  propertyRequestAdminRoutes: router,
};
