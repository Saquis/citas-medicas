const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  telefono: {
    type: String,
    required: false,
    trim: true
  },
  direccion: {
    type: String,
    required: false,
    trim: true
  },
  fechaNacimiento: {
    type: Date,
    required: false
  },
  // Otros campos que consideres necesarios, por ejemplo:
  genero: {
    type: String,
    enum: ['Masculino', 'Femenino', 'Otro'],
    default: 'Otro'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Paciente = mongoose.model('Paciente', pacienteSchema);

module.exports = Paciente;
