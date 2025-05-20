const express = require('express');
const router = express.Router();
const AuthC = require('../controladores/AuthC');
const { login } = require('../controladores/AuthC');
const { obtenerUsuarios } = require('../controladores/UsuariosC'); // si ya tienes otros

// Ruta para login
router.post('/login', login);

module.exports = router;
