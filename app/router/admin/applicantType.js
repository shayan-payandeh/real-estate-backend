const router = require('express').Router();
const expressAsyncHandler = require('express-async-handler');
const {
  ApplicantTypeContoller,
} = require('../../http/controllers/admin/applicantType/applicantType.contoller');

router.post(
  '/add',
  expressAsyncHandler(ApplicantTypeContoller.addNewApplicantType)
);
router.patch(
  '/update/:id',
  expressAsyncHandler(ApplicantTypeContoller.updateApplicantType)
);
router.delete(
  '/remove/:id',
  expressAsyncHandler(ApplicantTypeContoller.removeApplicantType)
);

module.exports = {
  ApplicantTypeAdminRoutes: router,
};
