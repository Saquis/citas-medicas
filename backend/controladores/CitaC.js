const mongoose = require('mongoose');
const Cita = require('../modelos/CitaM');
const ObjectId = mongoose.Types.ObjectId;

// Obtener todas las citas con datos de paciente y médico
exports.getCitas = async (req, res) => {
  try {
    const citas = await Cita.aggregate([
      {
        $lookup: {
          from: 'usuarios',
          localField: 'paciente_id',
          foreignField: '_id',
          as: 'paciente'
        }
      },
      { $unwind: '$paciente' },
      {
        $lookup: {
          from: 'usuarios',
          localField: 'medico_id',
          foreignField: '_id',
          as: 'medico'
        }
      },
      { $unwind: '$medico' },
      {
        $project: {
          fecha_hora: 1,
          paciente_nombre: '$paciente.nombre',
          medico_id: '$medico._id',
          medico_nombre: '$medico.nombre',
          estado: 1,
          especialidad: 1,
          duracion: 1,
          tipo_cita: 1,
          notas: 1,
          sintomas: 1,
          creado_en: 1,
          actualizado_en: 1,
          recordatorio_enviado: 1
        }
      }
    ]);
    res.status(200).json(citas);
  } catch (error) {
    console.error('❌ Error en getCitas:', error);
    res.status(500).json({ message: 'Error al obtener citas', error });
  }
};

// Obtener citas de un paciente autenticado
exports.getCitasPorPaciente = async (req, res) => {
  try {
    const pacienteObjectId = new ObjectId(req.user.id);

    console.log('📌 Paciente ID del token:', req.user.id);

    const citas = await Cita.aggregate([
      { $match: { paciente_id: pacienteObjectId } },
      {
        $lookup: {
          from: 'usuarios',
          localField: 'paciente_id',
          foreignField: '_id',
          as: 'paciente'
        }
      },
      { $unwind: '$paciente' },
      {
        $lookup: {
          from: 'usuarios',
          localField: 'medico_id',
          foreignField: '_id',
          as: 'medico'
        }
      },
      { $unwind: '$medico' },
      {
        $project: {
          fecha_hora: 1,
          paciente_nombre: '$paciente.nombre',
          medico_id: '$medico._id',
          medico_nombre: '$medico.nombre',
          estado: 1,
          especialidad: 1,
          duracion: 1,
          tipo_cita: 1,
          notas: 1,
          sintomas: 1,
          creado_en: 1,
          actualizado_en: 1,
          recordatorio_enviado: 1
        }
      }
    ]);
    res.status(200).json(citas);
  } catch (error) {
    console.error('❌ Error en getCitasPorPaciente:', error);
    res.status(500).json({ message: 'Error al obtener citas del paciente', error });
  }
};
