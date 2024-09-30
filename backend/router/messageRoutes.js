// messageRoutes.js

const express = require('express');
const router = express.Router();
const messageController = require('../controller/messageController');

// Route to create a new message
router.post('/messages', messageController.createMessage);

// Route to get all messages
router.get('/messages', messageController.getAllMessages);
router.get('/messages/:id', messageController.getMessageById);
router.post('/send-otp', messageController.sendOtp); 
router.get('/otp-history', messageController.getAllOtps);
router.delete('/delete-otp',messageController.deleteAllOtpHistory)
module.exports = router;
