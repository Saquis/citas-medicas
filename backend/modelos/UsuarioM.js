const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
  // --- Campos existentes en la colección ---
  nombre: { 
    type: String, 
    required: true 
  },
  usuario: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Validación como en la colección
    lowercase: true
  },
  password_hash: { 
    type: String, 
    required: true 
  },
  rol: { 
    type: String, 
    enum: ["administrador", "secretaria", "medico", "paciente"], // ✅ Coincide con la colección
    default: "paciente"
  },
  estado: {
    type: String,
    enum: ["activo", "inactivo", "pendiente"],
    default: "pendiente"
  },
  fecha_registro: { 
    type: Date, 
    default: Date.now 
  },
  // --- Campos anidados (opcionales) ---
  datos_personales: {
    documento_identidad: String,
    fecha_nacimiento: Date,
    direccion: String
  },
  datos_medico: {
    especialidad: String,
    numero_licencia: String
  }
});

// Método para comparar contraseñas
usuarioSchema.methods.comparePassword = async function(contrasena) {
  return await bcrypt.compare(contrasena, this.password_hash);
};

module.exports = mongoose.model('Usuario', usuarioSchema);