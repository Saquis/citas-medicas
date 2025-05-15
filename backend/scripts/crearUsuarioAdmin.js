
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Asegúrate de que esta URI esté bien
const client = new MongoClient(uri);
const dbName = 'citas_medicas';

const password = 'admin1';
const saltRounds = 10;

async function crearUsuario() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const hash = await bcrypt.hash(password, saltRounds);

    const resultado = await db.collection('usuarios').insertOne({
      nombre: 'Usuario de prueba',
      usuario: 'admin',
      correo: 'admin@prueba.com',
      password_hash: hash,
      rol: 'administrador',
      estado: 'activo',
      fecha_registro: new Date(),
    });

    console.log('Usuario insertado con _id:', resultado.insertedId);
  } catch (err) {
    console.error('Error al insertar usuario:', err);
  } finally {
    await client.close();
  }
}

crearUsuario();
