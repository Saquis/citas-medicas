const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'citas_medicas';

const usuarios = [
  {
    nombre: 'Administrador Principal',
    usuario: 'admin',
    correo: 'admin@prueba.com',
    contrasena: 'admin1',
    rol: 'administrador',
    estado: 'activo',
    datos_personales: {
      documento_identidad: '12345678',
      fecha_nacimiento: new Date('1980-01-01'),
      direccion: 'Calle Admin 123'
    }
  },
  {
    nombre: 'Juan Pérez',
    usuario: 'juanperez',
    correo: 'juan@prueba.com',
    contrasena: 'juan123',
    rol: 'paciente',
    estado: 'activo',
    datos_personales: {
      documento_identidad: '87654321',
      fecha_nacimiento: new Date('1990-05-15'),
      direccion: 'Avenida Paciente 456'
    }
  },
  {
    nombre: 'Dr. López',
    usuario: 'drlopez',
    correo: 'lopez@prueba.com',
    contrasena: 'lopez123',
    rol: 'medico',
    estado: 'activo',
    datos_personales: {
      documento_identidad: '45678912',
      fecha_nacimiento: new Date('1975-03-20'),
      direccion: 'Calle Médico 789'
    },
    datos_medico: {
      especialidad: 'Medicina General',
      numero_licencia: 'LIC12345'
    }
  },
  {
    nombre: 'Ana Gómez',
    usuario: 'anagomez',
    correo: 'ana@prueba.com',
    contrasena: 'ana123',
    rol: 'secretaria',
    estado: 'activo',
    datos_personales: {
      documento_identidad: '78912345',
      fecha_nacimiento: new Date('1985-07-10'),
      direccion: 'Calle Secretaria 101'
    }
  }
];

const saltRounds = 10;

async function crearUsuarios() {
  try {
    await client.connect();
    const db = client.db(dbName);

    const resultados = [];

    for (const nuevoUsuario of usuarios) {
      console.log('Procesando usuario:', nuevoUsuario.usuario); // Depuración
      // Verificar si el usuario ya existe
      const existente = await db.collection('usuarios').findOne({ usuario: nuevoUsuario.usuario });
      if (existente) {
        console.log(`El usuario '${nuevoUsuario.usuario}' ya existe. ID: ${existente._id}`);
        resultados.push({ usuario: nuevoUsuario.usuario, id: existente._id });
        continue;
      }

      // Encriptar contraseña para este usuario
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
        datos_personales: nuevoUsuario.datos_personales || {},
        datos_medico: nuevoUsuario.datos_medico || {}
      };

      console.log('Usuario a insertar:', usuarioFinal); // Depuración
      const resultado = await db.collection('usuarios').insertOne(usuarioFinal);
      console.log(`Usuario '${nuevoUsuario.usuario}' insertado con _id: ${resultado.insertedId}`);
      resultados.push({ usuario: nuevoUsuario.usuario, id: resultado.insertedId });
    }

    // Mostrar todos los IDs al final
    console.log('\nLista de usuarios y sus IDs:');
    resultados.forEach(res => console.log(`${res.usuario}: ${res.id}`));
  } catch (err) {
    console.error('Error al insertar usuarios:', err);
    if (err.errInfo && err.errInfo.details) {
      console.error('Detalles del error de validación:', err.errInfo.details);
    } else {
      console.error('Sin detalles adicionales de validación');
    }
  } finally {
    await client.close();
  }
}

crearUsuarios();