const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, trim: true, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true, default: 'USER' },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// PropertyRequestSchema.plugin(mongoosePaginate);

module.exports = {
  UserModel: mongoose.model('User', UserSchema),
};
