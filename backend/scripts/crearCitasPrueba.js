const mongoose = require('mongoose');
const Cita = require('../modelos/CitaM');

// Conexión a la base de datos (ajusta según tu .env o conexion.js)
mongoose.connect('mongodb://localhost:27017/citas_medicas', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Conectado a la base de datos');
    const citas = [
      {
        paciente_id: new mongoose.Types.ObjectId('68412e5ad27515f0f1f32af7'), // juanperez (paciente)
        medico_id: new mongoose.Types.ObjectId('68412e5ad27515f0f1f32af8'),   // drlopez (médico)
        fecha_hora: new Date('2025-06-05T10:00:00'),
        duracion: 30,
        estado: 'pendiente',
        tipo_cita: 'Consulta general',
        especialidad: 'Medicina general',
        notas: 'Primera consulta del paciente',
        sintomas: 'Dolor de cabeza',
        creado_por: new mongoose.Types.ObjectId('68412e5ad27515f0f1f32af9'), // anagomez (secretaria)
        creado_en: new Date(),
        actualizado_en: new Date(),
        recordatorio_enviado: false
      },
      {
        paciente_id: new mongoose.Types.ObjectId('68412e5ad27515f0f1f32af7'), // juanperez (paciente)
        medico_id: new mongoose.Types.ObjectId('68412e5ad27515f0f1f32af8'),   // drlopez (médico)
        fecha_hora: new Date('2025-06-06T14:00:00'),
        duracion: 45,
        estado: 'confirmada',
        tipo_cita: 'Seguimiento',
        especialidad: 'Cardiología',
        notas: 'Revisión post-tratamiento',
        sintomas: 'Fatiga',
        creado_por: new mongoose.Types.ObjectId('68412e5ad27515f0f1f32af9'), // anagomez (secretaria)
        creado_en: new Date(),
        actualizado_en: new Date(),
        recordatorio_enviado: true
      }
    ];

    return Cita.insertMany(citas);
  })
  .then(() => console.log('Citas insertadas'))
  .catch(err => console.error('Error:', err))
  .finally(() => mongoose.disconnect());