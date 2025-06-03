const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDB } = require('../configuraciones/conexion');

// Validación estricta de variable de entorno
if (!process.env.JWT_SECRET) {
  throw new Error('❌ Fatal: JWT_SECRET no está definido en .env');
}
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Controlador para autenticación de usuarios
 */
async function login(req, res) {
  const { usuario, contrasena } = req.body;

  // Validación básica
  if (!usuario || !contrasena) {
    return res.status(400).json({ 
      mensaje: 'Usuario y contraseña son requeridos',
      detalles: 'Campos faltantes en la solicitud'
    });
  }

  try {
    // 1. Buscar usuario (case-insensitive)
    const db = await getDB();
    const usuarios = db.collection('usuarios');
    
    const user = await usuarios.findOne({ 
      usuario: usuario.toLowerCase() 
    });

    if (!user) {
      return res.status(401).json({ 
        mensaje: 'Credenciales inválidas',
        codigo: 'CREDENCIALES_INCORRECTAS'
      });
    }

    // 2. Verificar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, user.password_hash);
    if (!contrasenaValida) {
      return res.status(401).json({
        mensaje: 'Credenciales inválidas',
        codigo: 'CREDENCIALES_INCORRECTAS'
      });
    }

    // 3. Generar token (con estructura consistente)
    const token = jwt.sign(
      {
        id: user._id,
        rol: user.rol,
        usuario: user.usuario
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    // 4. Respuesta exitosa (ocultando datos sensibles)
    res.json({
      mensaje: 'Autenticación exitosa',
      token,
      datosUsuario: {
        id: user._id,
        rol: user.rol,
        nombre: user.nombre,
        usuario: user.usuario
      }
    });

  } catch (error) {
    console.error('Error en auth/login:', error);
    res.status(500).json({ 
      mensaje: 'Error en el servidor',
      codigo: 'ERROR_SERVIDOR'
    });
  }
}

module.exports = { login };