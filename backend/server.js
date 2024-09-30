const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const messageRoutes = require('./router/messageRoutes'); // Adjust the path as needed

const app = express();
const port = 3001;

// Middleware
dotenv.config({ path: './config.env' });
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Check connection string
if (!process.env.CONN_STR) {
  console.error('CONN_STR is not defined in the environment variables');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.CONN_STR, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('MongoDB Connection Error:', error);
  });

// Routes
app.use('/api', messageRoutes); // Use message routes

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Contacts OTP App Backend');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
