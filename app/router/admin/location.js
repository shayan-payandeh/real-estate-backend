const router = require('express').Router();
const expressAsyncHandler = require('express-async-handler');
const {
  LocationController,
} = require('../../http/controllers/admin/location/location.controller');

router.post('/add', expressAsyncHandler(LocationController.addNewLocation));
router.patch(
  '/update/:id',
  expressAsyncHandler(LocationController.updateLocation)
);
router.delete(
  '/remove/:id',
  expressAsyncHandler(LocationController.removeLocation)
);

module.exports = {
  locationAdminRoutes: router,
};
