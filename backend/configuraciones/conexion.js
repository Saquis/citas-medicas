// backend/configuraciones/conexion.js
const mongoose = require('mongoose');

async function getDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.db;
  }
  
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/citas_medicas', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  return mongoose.connection.db;
}

module.exports = { getDB };