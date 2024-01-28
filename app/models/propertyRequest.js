const { string } = require('joi');
const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate-v2');

const PropertyRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, trim: true, required: true },
    type: { type: objectId, ref: 'Type', required: true },
    category: { type: objectId, ref: 'Category', required: true },
    location: { type: objectId, ref: 'Location' },
    applicantType: { type: objectId, ref: 'ApplicantType', required: true },
    images: { type: Array },
    meter: { type: Number },
    propertyAge: { type: Number, required: true },
    floors: { type: Number },
    floor: { type: Number },
    units: { type: Number },
    rooms: { type: Number },
    parking: { type: Boolean, required: true },
    warehouse: { type: Boolean, required: true },
    elevator: { type: Boolean, required: true },
    budget: { type: Number },
    isChecked: { type: Boolean, default: false },
    priority: { type: Number, default: 2 },
    description: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  { timestamps: true }
);

PropertyRequestSchema.plugin(mongoosePaginate);

module.exports = {
  PropertyRequestModel: mongoose.model(
    'PropertyRequest',
    PropertyRequestSchema
  ),
};
