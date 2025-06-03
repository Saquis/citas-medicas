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

// Ruta pública
router.post('/login', login);

// Rutas protegidas
router.get('/usuarios', verificarToken, verificarRol([ROLES.ADMINISTRADOR]), obtenerUsuarios);
router.get('/usuarios/:id', verificarToken, verificarPropietarioOAdmin, obtenerUsuarioPorId);
router.post('/usuarios', verificarToken, verificarRol([ROLES.ADMINISTRADOR]), crearUsuario);
router.put('/usuarios/:id', verificarToken, verificarPropietarioOAdmin, editarUsuario);
router.patch('/usuarios/:id/cambiar-password', verificarToken, verificarPropietarioOAdmin, cambiarPassword);
router.delete('/usuarios/:id', verificarToken, verificarRol([ROLES.ADMINISTRADOR]), eliminarUsuario);

module.exports = router;