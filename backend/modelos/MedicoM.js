// modelos/MedicoM.js
const mongoose = require('mongoose');

const medicoSchema = new mongoose.Schema({
  nombreCompleto: String,
  especialidad: String,
  correo: String,
  telefono: String
});

module.exports = mongoose.model('Medico', medicoSchema);
