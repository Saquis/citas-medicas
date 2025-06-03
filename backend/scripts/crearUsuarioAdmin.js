const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'citas_medicas';

const nuevoUsuario = {
  nombre: 'Administrador Principal',
  usuario: 'admin',
  correo: 'admin@prueba.com',
  contrasena: 'admin1',
  rol: 'administrador',
  estado: 'activo',
};

const saltRounds = 10;

async function crearUsuario() {
  try {
    await client.connect();
    const db = client.db(dbName);

    // Verificar si el usuario ya existe
    const existente = await db.collection('usuarios').findOne({ usuario: nuevoUsuario.usuario });
    if (existente) {
      console.log(  ` El usuario '${nuevoUsuario.usuario}' ya existe.`);
      return;
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(nuevoUsuario.contrasena, saltRounds);

    // Crear objeto usuario con hash
    const usuarioFinal = {
      nombre: nuevoUsuario.nombre,
      usuario: nuevoUsuario.usuario,
      correo: nuevoUsuario.correo,
      password_hash: hash,
      rol: nuevoUsuario.rol,
      estado: nuevoUsuario.estado,
      fecha_registro: new Date(),
    };

    const resultado = await db.collection('usuarios').insertOne(usuarioFinal);
    console.log(' Usuario insertado con _id:', resultado.insertedId);
  } catch (err) {
    console.error(' Error al insertar usuario:', err);
  } finally {
    await client.close();
  }
}

crearUsuario();
