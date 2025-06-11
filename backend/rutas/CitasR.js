const express = require('express');
const router = express.Router();
const citasController = require('../controladores/CitaC');
const { verificarToken, verificarRol } = require('../configuraciones/autorizacion');

// Obtener todas las citas (admin, médico, etc.)
router.get('/citas', verificarToken, citasController.getCitas);

// Obtener citas del paciente autenticado (usando token, no por URL)
router.get('/pacientes/mis-citas', verificarToken, verificarRol('paciente'), citasController.getCitasPorPaciente);

module.exports = router;
