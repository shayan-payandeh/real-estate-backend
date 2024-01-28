const router = require('express').Router();
const expressAsyncHandler = require('express-async-handler');
const {
  UserController,
} = require('../../http/controllers/admin/user/user.controller');
const { verifyAccessToken } = require('../../http/middlewares/user.middleware');

router.get(
  '/list',
  verifyAccessToken,
  expressAsyncHandler(UserController.getAllUser)
);

router.delete(
  '/remove/:id',
  verifyAccessToken,
  expressAsyncHandler(UserController.removeUser)
);

module.exports = {
  userAdminRoutes: router,
};
