const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  contactName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String, // Changed to String for better handling of phone numbers
    required: true
  },
}, { timestamps: true }); // Removed extra comma

const Message = mongoose.model('ContactMessage', messageSchema);

module.exports = Message;
