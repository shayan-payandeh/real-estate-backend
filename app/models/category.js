const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    englishTitle: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

CategorySchema.plugin(mongoosePaginate);

module.exports = {
  CategoryModel: mongoose.model('Category', CategorySchema),
};
