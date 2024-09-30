// messageController.js
const twilio = require('twilio');
const OtpHistory = require('../model/OtpHistory');
const dotenv = require('dotenv');
const Message = require('../model/contact'); 
dotenv.config({ path: './config.env' });// Adjust the path as needed
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN;  // Your Twilio Auth Token
console.log("account",accountSid);
console.log("auth",authToken);
 // Your Twilio Auth Token
 const client = require('twilio')(accountSid, authToken);
// Create a new message
exports.createMessage = async (req, res) => {
  const { contactName, phoneNumber } = req.body;

  try {
    const newMessage = await Message.create({ contactName, phoneNumber });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }); // Sort by date descending
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getMessageById = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP

  try {
    // Send OTP via Twilio
    await client.messages.create({
      body: `Hi. Your OTP is: ${otp}`,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
    const formattedPhoneNumber = phoneNumber.startsWith('+91') 
    ? phoneNumber.slice(3) // Remove the first 3 characters (+91)
    : phoneNumber; // Keep the number as is if it doesn't start with +91
  
  const contact = await Message.findOne({ phoneNumber: formattedPhoneNumber });
  


   
    console.log("check contact",contact);
    const otpHistory = new OtpHistory({
      contactName: contact ? contact.contactName : 'Unknown',
      phoneNumber: phoneNumber,
      otp: otp, 
    });
    await otpHistory.save();

    res.status(200).json({ message: 'OTP sent successfully', otp });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP', details: error.message });
  }
};



exports.getAllOtps = async (req, res) => {
  try {
    const otpHistory = await OtpHistory.find().sort({ createdAt: -1 }); // Sort in descending order
    res.status(200).json(otpHistory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch OTP history', details: error.message });
  }
};


// Assuming you're using Express.js and Mongoose

// Route to delete all OTP history
exports.deleteAllOtpHistory = async (req, res) => {
  try {
    await OtpHistory.deleteMany({}); // This will delete all documents in the OtpHistory collection
    res.status(200).json({ message: 'All OTP history deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete OTP history', details: error.message });
  }
};
