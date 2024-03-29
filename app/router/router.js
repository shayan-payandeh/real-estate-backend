const router = require('express').Router();
const { verifyAccessToken } = require('../http/middlewares/user.middleware');
const { adminRoutes } = require('./admin/admin.routes');
const { categoryRoutes } = require('./category');
const { locationRoutes } = require('./location');
const { applicantTypeRoutes } = require('./applicantType');
const { propertyRequestRoutes } = require('./propertyRequest');
const { typeRoutes } = require('./type');
const { userRoutes } = require('./user');

router.use('/admin', verifyAccessToken, adminRoutes);
router.use('/category', categoryRoutes);
router.use('/location', locationRoutes);
router.use('/applicantType', applicantTypeRoutes);
router.use('/type', typeRoutes);
router.use('/user', userRoutes);
router.use('/propertyRequest', propertyRequestRoutes);

module.exports = { allRoutes: router };
