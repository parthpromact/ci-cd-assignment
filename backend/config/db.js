const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://parthpatelpromactinfo_db_user:FoHYYjP5KjAWQE4D@cluster0.b82vzzg.mongodb.net/';
const db = mongoose.connect(MONGODB_URI)
  .then(() => console.log('DB Connected'))
  .catch(err => console.error('DB Error:', err));

module.exports = db;