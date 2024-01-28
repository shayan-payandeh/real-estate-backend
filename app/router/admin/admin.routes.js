const { authorize } = require('../../http/middlewares/permission.guard');
const { categoryAdminRoutes } = require('./category');
const { locationAdminRoutes } = require('./location');
const { ApplicantTypeAdminRoutes } = require('./applicantType');
const { ROLES } = require('../../../utils/constants');
const { propertyRequestAdminRoutes } = require('./propertyRequest');
const { userAdminRoutes } = require('./user');
const { typeAdminRoutes } = require('./type');

const router = require('express').Router();

router.use('/category', authorize(ROLES.ADMIN), categoryAdminRoutes);
router.use('/location', authorize(ROLES.ADMIN), locationAdminRoutes);
router.use('/applicantType', authorize(ROLES.ADMIN), ApplicantTypeAdminRoutes);
router.use('/type', authorize(ROLES.ADMIN), typeAdminRoutes);
router.use(
  '/propertyRequest',
  authorize(ROLES.ADMIN),
  propertyRequestAdminRoutes
);
router.use('/user', authorize(ROLES.ADMIN), userAdminRoutes);

module.exports = {
  adminRoutes: router,
};
