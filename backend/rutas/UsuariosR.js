const express = require('express');
const router = express.Router();

// Importa CADA método individualmente
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  editarUsuario,
  cambiarPassword,
  eliminarUsuario
} = require('../controladores/UsuariosC');

const { login } = require('../controladores/AuthC');

const {
  verificarToken,
  verificarRol,
  verificarPropietarioOAdmin,
  ROLES
} = require('../configuraciones/autorizacion');

// Ruta pública para login, aquí deberías evaluar si dejarla en este archivo o moverla a otro router (opcional)
//router.post('/login', login);

// Rutas protegidas, sin repetir 'usuarios' en la ruta
router.get('/', verificarToken, verificarRol([ROLES.ADMINISTRADOR]), obtenerUsuarios);
router.get('/:id', verificarToken, verificarPropietarioOAdmin, obtenerUsuarioPorId);
router.post('/', verificarToken, verificarRol([ROLES.ADMINISTRADOR]), crearUsuario);
router.put('/:id', verificarToken, verificarPropietarioOAdmin, editarUsuario);
router.patch('/:id/cambiar-password', verificarToken, verificarPropietarioOAdmin, cambiarPassword);
router.delete('/:id', verificarToken, verificarRol([ROLES.ADMINISTRADOR]), eliminarUsuario);

module.exports = router;
