const OtpHistory = require('../model/OtpHistory'); // Import the model
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
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

    // Save OTP and contact info to the database
    const contact = await Message.findOne({ phoneNumber });
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
