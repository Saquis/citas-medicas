const express = require('express');
const router = express.Router();
const citasController = require('../controladores/CitaC');
const { verificarToken, verificarRol } = require('../configuraciones/autorizacion'); // Ruta correcta

router.get('/citas', verificarToken, citasController.getCitas);
router.get('/pacientes/:id/citas', verificarToken, verificarRol('paciente'), citasController.getCitasPorPaciente);

module.exports = router;