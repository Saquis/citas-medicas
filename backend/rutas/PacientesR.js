const express = require('express');
const router = express.Router();
const PacientesC = require('../controladores/PacientesC');
const { verificarToken } = require('../configuraciones/autorizacion');

// Obtener citas de un paciente (ya tienes esta)
router.get('/:id/citas', verificarToken, PacientesC.obtenerCitasPorPaciente);

// CRUD para pacientes
router.get('/', verificarToken, PacientesC.obtenerPacientes); // Leer todos los pacientes
router.get('/:id', verificarToken, PacientesC.obtenerPacientePorId); // Leer paciente específico

router.post('/', verificarToken, PacientesC.crearPaciente); // Crear nuevo paciente

router.put('/:id', verificarToken, PacientesC.actualizarPaciente); // Actualizar paciente

router.delete('/:id', verificarToken, PacientesC.eliminarPaciente); // Eliminar paciente (con validación)

module.exports = router;
