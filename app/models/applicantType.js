const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ApplicantTypeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    englishTitle: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

ApplicantTypeSchema.plugin(mongoosePaginate);

module.exports = {
  ApplicantTypeModel: mongoose.model('ApplicantType', ApplicantTypeSchema),
};
