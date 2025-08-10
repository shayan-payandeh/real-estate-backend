const router = require('express').Router();
const expressAsyncHandler = require('express-async-handler');
const {
  LocationController,
} = require('../http/controllers/admin/location/location.controller');

router.get('/list', expressAsyncHandler(LocationController.getListOfLocations));

router.get('/:id', expressAsyncHandler(LocationController.getLocationById));

module.exports = {
  locationRoutes: router,
};
