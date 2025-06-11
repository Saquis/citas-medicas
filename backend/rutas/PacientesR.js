const express = require('express');
const router = express.Router();
const PacientesC = require('../controladores/PacientesC');
const { verificarToken } = require('../configuraciones/autorizacion');

router.get('/:id/citas', verificarToken, PacientesC.obtenerCitasPorPaciente);

module.exports = router;
