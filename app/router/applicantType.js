const router = require('express').Router();
const expressAsyncHandler = require('express-async-handler');
const {
  ApplicantTypeContoller,
} = require('../http/controllers/admin/applicantType/applicantType.contoller');

router.get(
  '/list',
  expressAsyncHandler(ApplicantTypeContoller.getListOfApplicantType)
);

router.get(
  '/:id',
  expressAsyncHandler(ApplicantTypeContoller.getApplicantTypeById)
);

module.exports = {
  applicantTypeRoutes: router,
};
