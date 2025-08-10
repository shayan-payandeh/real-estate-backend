const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate-v2');

const PropertyRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, trim: true, required: true },
    type: { type: objectId, ref: 'Type', required: true },
    category: { type: objectId, ref: 'Category', required: true },
    location: { type: objectId, ref: 'Location', required: true },
    applicantType: { type: objectId, ref: 'ApplicantType', required: true },
    propertyStatus: { type: objectId, ref: 'PropertyStatus' },
    images: { type: Array },
    meter: { type: Number, required: true },
    propertyAge: { type: Number },
    floors: { type: Number, required: true },
    floor: { type: Number, required: true },
    units: { type: Number },
    rooms: { type: Number, required: true },
    parking: { type: Boolean },
    warehouse: { type: Boolean },
    elevator: { type: Boolean },
    balcony: { type: Boolean },
    lobby: { type: Boolean },
    roofGarden: { type: Boolean },
    meetingRoom: { type: Boolean },
    gym: { type: Boolean },
    budget: { type: Number, required: true },
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
