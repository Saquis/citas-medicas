const express = require('express');
const router = express.Router();

const citasController = require('../controladores/CitaC');
const usuarioController = require('../controladores/UsuariosC');

const { verificarToken, verificarRol } = require('../configuraciones/autorizacion');

// ------------------------- RUTAS DE CITAS ------------------------- //
router.get('/citas', verificarToken, verificarRol(['administrador', 'secretaria']), citasController.getCitas); // Cambiado a un solo verificarRol con array
router.get('/pacientes/mis-citas', verificarToken, verificarRol('paciente'), citasController.getCitasPorPaciente);
router.post('/citas', verificarToken, verificarRol('secretaria'), citasController.crearCita);
router.put('/citas/:id', verificarToken, verificarRol('secretaria'), citasController.editarCita);
router.delete('/citas/:id', verificarToken, verificarRol('secretaria'), citasController.eliminarCita);

// ------------------------- RUTAS DE USUARIOS (CRUD ADMINISTRADOR) ------------------------- //
router.get('/usuarios', verificarToken, verificarRol('administrador'), usuarioController.obtenerUsuarios);
router.post('/usuarios', verificarToken, verificarRol('administrador'), usuarioController.crearUsuario);
router.get('/usuarios/:id', verificarToken, usuarioController.obtenerUsuarioPorId);
router.put('/usuarios/:id', verificarToken, usuarioController.editarUsuario);
router.delete('/usuarios/:id', verificarToken, verificarRol('administrador'), usuarioController.eliminarUsuario);

module.exports = router;