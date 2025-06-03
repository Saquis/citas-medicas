const jwt = require('jsonwebtoken');

// Validación estricta de variable de entorno
if (!process.env.JWT_SECRET) {
  throw new Error(' La variable JWT_SECRET no está configurada en .env');
}
const claveSecreta = process.env.JWT_SECRET;

/**
 * Middleware para verificar tokens JWT
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para continuar el flujo
 */
const verificarToken = (req, res, next) => {
  // 1. Extraer token de headers
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ 
      mensaje: 'Token no proporcionado',
      detalles: 'Formato esperado: "Bearer <token>"'
    });
  }

  // 2. Verificar token
  jwt.verify(token, claveSecreta, (err, payload) => {
    if (err) {
      const mensajeError = err.name === 'TokenExpiredError' 
        ? 'Token expirado' 
        : 'Token inválido';
      return res.status(403).json({ mensaje: mensajeError });
    }

    // 3. Adjuntar datos de usuario verificados a la solicitud
    req.usuario = {
      id: payload.id,
      rol: payload.rol, // Aseguramos que coincida con UsuarioM.js
      usuario: payload.usuario // Opcional: para logs
    };

    next();
  });
};

module.exports = verificarToken;