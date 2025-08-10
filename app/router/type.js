const router = require('express').Router();
const expressAsyncHandler = require('express-async-handler');
const {
  TypeController,
} = require('../http/controllers/admin/type/type.controller');

router.get('/list', expressAsyncHandler(TypeController.getListOfTypes));
router.get('/:id', expressAsyncHandler(TypeController.getTypeById));

module.exports = {
  typeRoutes: router,
};
