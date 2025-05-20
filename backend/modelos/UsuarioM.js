const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'user'], default: 'user' }
});

// Método para comparar contraseñas
usuarioSchema.methods.comparePassword = async function(contrasena) {
  return await bcrypt.compare(contrasena, this.password_hash);
};

module.exports = mongoose.model('Usuario', usuarioSchema);