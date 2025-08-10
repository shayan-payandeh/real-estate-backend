const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const TypeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    englishTitle: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

TypeSchema.plugin(mongoosePaginate);

module.exports = {
  TypeModel: mongoose.model('Type', TypeSchema),
};
