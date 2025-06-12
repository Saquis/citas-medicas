// rutas/MedicosR.js
const express = require('express');
const router = express.Router();
const Medico = require('../modelos/MedicoM');

// Ruta: Obtener todos los médicos
router.get('/', async (req, res) => {
  try {
    const medicos = await Medico.find();
    res.json(medicos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los médicos' });
  }
});

module.exports = router;
