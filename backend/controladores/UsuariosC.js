const bcrypt = require('bcrypt');
const { getDB } = require('../configuraciones/conexion');
const { ObjectId } = require('mongodb');

// ------------------------- FUNCIONES AUXILIARES ------------------------- //
/**
 * Verifica si el usuario es administrador.
 * @param {Object} usuario - Objeto usuario de la solicitud.
 * @returns {Boolean} - True si es administrador.
 */
const esAdministrador = (usuario) => usuario?.rol === 'administrador';

/**
 * Maneja errores comunes en las respuestas.
 * @param {Object} res - Objeto respuesta de Express.
 * @param {Error} error - Error capturado.
 */
const manejarError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ mensaje: 'Error del servidor' });
};

// ------------------------- CONTROLADORES ------------------------- //

/**
 * Crear un nuevo usuario (solo administradores).
 */
const crearUsuario = async (req, res) => {
  try {
    const db = await getDB();
    const usuarios = db.collection('usuarios');
    const { nombre, usuario, correo, password, rol } = req.body;

    // Verificación de campos requeridos
    if (!nombre || !usuario || !correo || !password || !rol) {
      return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
    }

    // Verificar permisos de administrador
    if (!esAdministrador(req.usuario)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para crear usuarios' });
    }

    // Normalizar y verificar duplicados
    const usuarioNormalizado = usuario.toLowerCase();
    const correoNormalizado = correo.toLowerCase();
    const existente = await usuarios.findOne({
      $or: [{ usuario: usuarioNormalizado }, { correo: correoNormalizado }]
    });

    if (existente) {
      return res.status(409).json({ mensaje: 'Usuario o correo ya existe' });
    }

    // Crear usuario
    const nuevoUsuario = {
      nombre,
      usuario: usuarioNormalizado,
      correo: correoNormalizado,
      password_hash: await bcrypt.hash(password, 10),
      rol,
      estado: 'activo',
      fecha_registro: new Date()
    };

    const resultado = await usuarios.insertOne(nuevoUsuario);
    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      id: resultado.insertedId
    });

  } catch (error) {
    manejarError(res, error);
  }
};

/**
 * Obtener todos los usuarios (solo administradores).
 */
const obtenerUsuarios = async (req, res) => {
  try {
    const db = await getDB();
    const usuarios = db.collection('usuarios');

    if (!esAdministrador(req.usuario)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver los usuarios' });
    }

    const lista = await usuarios
      .find({}, { projection: { password_hash: 0, token_acceso: 0, reseteo_password: 0 } })
      .toArray();

    res.status(200).json(lista);
  } catch (error) {
    manejarError(res, error);
  }
};

/**
 * Obtener un usuario por ID (admin o propio usuario).
 */
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const db = await getDB();
    const usuarios = db.collection('usuarios');
    const { id } = req.params;

    if (!esAdministrador(req.usuario) && req.usuario?.id !== id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver este usuario' });
    }

    const usuario = await usuarios.findOne(
      { _id: new ObjectId(id) },
      { projection: { password_hash: 0, token_acceso: 0, reseteo_password: 0 } }
    );

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    manejarError(res, error);
  }
};

/**
 * Editar usuario (admin puede editar todo, usuario solo su nombre).
 */
const editarUsuario = async (req, res) => {
  try {
    const db = await getDB();
    const usuarios = db.collection('usuarios');
    const { id } = req.params;

    if (!esAdministrador(req.usuario) && req.usuario?.id !== id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para editar este usuario' });
    }

    // Filtrar campos editables según rol
    let camposActualizables = req.body;
    if (!esAdministrador(req.usuario)) {
      camposActualizables = { nombre: req.body.nombre };
    }

    // Eliminar campos protegidos
    delete camposActualizables.password_hash;
    delete camposActualizables.token_acceso;

    // Validar duplicados al actualizar correo/usuario
    if (camposActualizables.correo) {
      camposActualizables.correo = camposActualizables.correo.toLowerCase();
      const correoExistente = await usuarios.findOne({
        correo: camposActualizables.correo,
        _id: { $ne: new ObjectId(id) }
      });
      if (correoExistente) return res.status(409).json({ mensaje: 'El correo ya está en uso' });
    }

    if (camposActualizables.usuario) {
      camposActualizables.usuario = camposActualizables.usuario.toLowerCase();
      const usuarioExistente = await usuarios.findOne({
        usuario: camposActualizables.usuario,
        _id: { $ne: new ObjectId(id) }
      });
      if (usuarioExistente) return res.status(409).json({ mensaje: 'El usuario ya está en uso' });
    }

    const resultado = await usuarios.updateOne(
      { _id: new ObjectId(id) },
      { $set: camposActualizables }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    manejarError(res, error);
  }
};

/**
 * Cambiar contraseña (solo propio usuario).
 */
const cambiarPassword = async (req, res) => {
  try {
    const db = await getDB();
    const usuarios = db.collection('usuarios');
    const { id } = req.params;
    const { password_actual, nuevo_password } = req.body;

    if (req.usuario?.id !== id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para cambiar esta contraseña' });
    }

    if (!password_actual || !nuevo_password) {
      return res.status(400).json({ mensaje: 'Se requieren ambas contraseñas' });
    }

    const usuario = await usuarios.findOne({ _id: new ObjectId(id) });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const passwordValido = await bcrypt.compare(password_actual, usuario.password_hash);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Contraseña actual incorrecta' });
    }

    await usuarios.updateOne(
      { _id: new ObjectId(id) },
      { $set: { password_hash: await bcrypt.hash(nuevo_password, 10) } }
    );

    res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    manejarError(res, error);
  }
};

/**
 * Eliminar usuario (solo administradores, no auto-eliminación).
 */
const eliminarUsuario = async (req, res) => {
  try {
    const db = await getDB();
    const usuarios = db.collection('usuarios');
    const { id } = req.params;

    if (!esAdministrador(req.usuario)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar usuarios' });
    }

    if (req.usuario?.id === id) {
      return res.status(400).json({ mensaje: 'No puedes eliminarte a ti mismo' });
    }

    const resultado = await usuarios.deleteOne({ _id: new ObjectId(id) });
    if (resultado.deletedCount === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    manejarError(res, error);
  }
};

// ✅ EXPORTACIÓN CORREGIDA - FALTABA PUNTO Y COMA AL FINAL
module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  editarUsuario,
  cambiarPassword,
  eliminarUsuario
};