const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const LocationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    englishTitle: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

LocationSchema.plugin(mongoosePaginate);

module.exports = {
  LocationModel: mongoose.model('Location', LocationSchema),
};
