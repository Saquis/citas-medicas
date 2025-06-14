const express = require('express');
const router = express.Router();

const citasController = require('../controladores/CitaC');
const usuarioController = require('../controladores/UsuariosC');
const { verificarToken, verificarRol } = require('../configuraciones/autorizacion');

// Rutas base: /api/citas
router.get('/', verificarToken, verificarRol(['administrador', 'secretaria', 'medico']), citasController.getCitas);
router.get('/pacientes/mis-citas', verificarToken, verificarRol('paciente'), citasController.getCitasPorPaciente);
router.post('/', verificarToken, verificarRol('secretaria'), citasController.crearCita);
router.put('/:id', verificarToken, verificarRol('secretaria'), citasController.editarCita);
router.delete('/:id', verificarToken, verificarRol('secretaria'), citasController.eliminarCita);

// Rutas de usuario como parte de este router 
router.get('/usuarios', verificarToken, verificarRol('administrador'), usuarioController.obtenerUsuarios);
router.post('/usuarios', verificarToken, verificarRol('administrador'), usuarioController.crearUsuario);
router.get('/usuarios/:id', verificarToken, usuarioController.obtenerUsuarioPorId);
router.put('/usuarios/:id', verificarToken, usuarioController.editarUsuario);
router.delete('/usuarios/:id', verificarToken, verificarRol('administrador'), usuarioController.eliminarUsuario);

module.exports = router;
