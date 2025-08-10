const router = require('express').Router();
const expressAsyncHandler = require('express-async-handler');
const {
  PropertyStatusController,
} = require('../../http/controllers/admin/propertyStatus/propertyStatus.controller');

router.post(
  '/add',
  expressAsyncHandler(PropertyStatusController.addNewPropertyStatus)
);
router.patch(
  '/update/:id',
  expressAsyncHandler(PropertyStatusController.updatePropertyStatus)
);
router.delete(
  '/remove/:id',
  expressAsyncHandler(PropertyStatusController.removePropertyStatus)
);

module.exports = {
  propertyStatusAdminRoutes: router,
};
