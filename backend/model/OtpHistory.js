const mongoose = require('mongoose');

const otpHistorySchema = new mongoose.Schema({
  contactName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const OtpHistory = mongoose.model('OtpHistory', otpHistorySchema);

module.exports = OtpHistory;
