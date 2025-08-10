const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const propertyStatusSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    englishTitle: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

propertyStatusSchema.plugin(mongoosePaginate);

module.exports = {
  PropertyStatusModel: mongoose.model('PropertyStatus', propertyStatusSchema),
};
