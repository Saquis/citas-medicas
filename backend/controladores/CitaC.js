const Cita = require('../modelos/CitaM');

exports.getCitas = async (req, res) => {
  try {
    const citas = await Cita.aggregate([
      // Unir con la colección usuarios para obtener datos del paciente
      {
        $lookup: {
          from: 'usuarios',
          localField: 'paciente_id',
          foreignField: '_id',
          as: 'paciente'
        }
      },
      { $unwind: '$paciente' }, // Desenrollar el array de paciente
      // Unir con la colección usuarios para obtener datos del médico
      {
        $lookup: {
          from: 'usuarios',
          localField: 'medico_id',
          foreignField: '_id',
          as: 'medico'
        }
      },
      { $unwind: '$medico' }, // Desenrollar el array de médico
      // Proyectar los campos deseados
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
    res.status(500).json({ message: 'Error al obtener citas', error });
  }
};

exports.getCitasPorPaciente = async (req, res) => {
  try {
    const pacienteId = req.user.id; // Asume que verificarToken añade req.user.id
    const citas = await Cita.aggregate([
      { $match: { paciente_id: pacienteId } }, // Filtrar por paciente_id
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
    res.status(500).json({ message: 'Error al obtener citas del paciente', error });
  }
};