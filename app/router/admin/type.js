const router = require('express').Router();
const expressAsyncHandler = require('express-async-handler');
const {
  TypeController,
} = require('../../http/controllers/admin/type/type.controller');

router.post('/add', expressAsyncHandler(TypeController.addNewType));
router.patch('/update/:id', expressAsyncHandler(TypeController.updateType));
router.delete('/remove/:id', expressAsyncHandler(TypeController.removeType));

module.exports = {
  typeAdminRoutes: router,
};
