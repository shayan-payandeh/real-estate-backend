const router = require("express").Router();
const expressAsyncHandler = require("express-async-handler");
const {
  UserController,
} = require("../http/controllers/admin/user/user.controller");
const {
  verifyAccessToken,
  decideAuthMiddleware,
} = require("../http/middlewares/user.middleware");

router.post("/login", expressAsyncHandler(UserController.login));
router.post("/register", expressAsyncHandler(UserController.registerUser));
router.post("/logout", expressAsyncHandler(UserController.logout));
router.patch(
  "/update/:id",
  expressAsyncHandler(UserController.updateUserProfile)
);
router.get(
  "/profile",
  verifyAccessToken,
  expressAsyncHandler(UserController.getUserProfile)
);

module.exports = {
  userRoutes: router,
};
