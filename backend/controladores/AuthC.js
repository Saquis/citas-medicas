const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/UsuarioM'); // Asegúrate de tener este modelo

const JWT_SECRET = 'clave_secreta_super_segura'; // ¡Usa process.env en producción!

async function login(req, res) {
  const { usuario, contrasena } = req.body;
  
  if (!usuario || !contrasena) {
    return res.status(400).json({ mensaje: 'Usuario y contraseña requeridos.' });
  }

  try {
    // Busca el usuario usando Mongoose
    const user = await Usuario.findOne({ usuario });
    
    if (!user) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    const valid = await bcrypt.compare(contrasena, user.password_hash);
    if (!valid) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: user._id, rol: user.rol }, 
      JWT_SECRET, 
      { expiresIn: '2h' }
    );

    res.json({
      mensaje: 'Autenticación exitosa.',
      token,
      rol: user.rol,
      usuario: user.usuario
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

module.exports = { login };