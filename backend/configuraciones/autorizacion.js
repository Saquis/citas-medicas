const jwt = require('jsonwebtoken');

// Validación de JWT_SECRET
if (!process.env.JWT_SECRET) {
  throw new Error(' Fatal: JWT_SECRET no está definido en .env');
}
const JWT_SECRET = process.env.JWT_SECRET;

const ROLES = {
  ADMINISTRADOR: 'administrador',
  SECRETARIA: 'secretaria',
  MEDICO: 'medico',
  PACIENTE: 'paciente'
};

// ✅ MIDDLEWARE FALTANTE: verificarToken
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ mensaje: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token inválido' });
  }
}

// Middleware genérico para verificar roles
function verificarRol(rolesPermitidos = []) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ mensaje: 'No autenticado' });
    }

    if (rolesPermitidos.includes(req.usuario.rol)) {
      next();
    } else {
      res.status(403).json({ 
        mensaje: `Acceso denegado. Rol requerido: ${rolesPermitidos.join(', ')}`,
        codigo: 'ACCESO_NO_AUTORIZADO'
      });
    }
  };
}

// ✅ MIDDLEWARE FALTANTE: verificarPropietarioOAdmin
function verificarPropietarioOAdmin(req, res, next) {
  const userId = req.params.id;
  if (req.usuario?.rol === ROLES.ADMINISTRADOR || req.usuario?.id === userId) {
    next();
  } else {
    res.status(403).json({
      mensaje: 'Acceso denegado',
      codigo: 'ACCESO_NO_AUTORIZADO'
    });
  }
}

// Middlewares específicos
const soloAdmin = verificarRol([ROLES.ADMINISTRADOR]);
const mismoUsuarioOAdmin = (req, res, next) => {
  const userId = req.params.id;
  if (req.usuario?.rol === ROLES.ADMINISTRADOR || req.usuario?.id === userId) {
    next();
  } else {
    res.status(403).json({
      mensaje: 'Acceso denegado',
      codigo: 'ACCESO_NO_AUTORIZADO'
    });
  }
};

module.exports = {
  verificarToken,
  verificarRol,
  verificarPropietarioOAdmin,
  soloAdmin,
  mismoUsuarioOAdmin,
  ROLES
};