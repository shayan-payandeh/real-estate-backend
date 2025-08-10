const { authorize } = require("../../http/middlewares/permission.guard");
const { categoryAdminRoutes } = require("./category");
const { locationAdminRoutes } = require("./location");
const { ApplicantTypeAdminRoutes } = require("./applicantType");
const { ROLES } = require("../../../utils/constants");
const { propertyRequestAdminRoutes } = require("./propertyRequest");
const { userAdminRoutes } = require("./user");
const { typeAdminRoutes } = require("./type");
const { propertyStatusAdminRoutes } = require("./propertyStatus");

const router = require("express").Router();

// router.use('/category', authorize(ROLES.ADMIN), categoryAdminRoutes);
router.use("/category", categoryAdminRoutes);
// router.use('/location', authorize(ROLES.ADMIN), locationAdminRoutes);
router.use("/location", locationAdminRoutes);
// router.use('/applicantType', authorize(ROLES.ADMIN), ApplicantTypeAdminRoutes);
router.use("/applicantType", ApplicantTypeAdminRoutes);
// router.use('/type', authorize(ROLES.ADMIN), typeAdminRoutes);
router.use("/type", typeAdminRoutes);
// router.use(
//   '/propertyRequest',
//   authorize(ROLES.ADMIN),
//   propertyRequestAdminRoutes
// );
router.use(
  "/propertyRequest",

  propertyRequestAdminRoutes
);
// router.use('/user', authorize(ROLES.ADMIN), userAdminRoutes);
router.use("/user", userAdminRoutes);
// router.use(
//   '/propertyStatus',
//   authorize(ROLES.ADMIN),
//   propertyStatusAdminRoutes
// );
router.use("/propertyStatus", propertyStatusAdminRoutes);

module.exports = {
  adminRoutes: router,
};
