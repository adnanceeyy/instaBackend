const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', require('./routes/api'));

app.get('/', (req, res) => {
  res.send('CaptionCraft AI API is running');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('Ensure you have MONGO_URI set in Render environment variables.');
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
