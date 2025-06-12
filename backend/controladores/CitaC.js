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
    console.error('Error en getCitas:', error);
    res.status(500).json({ message: 'Error al obtener citas', error });
  }
};

// Obtener citas de un paciente autenticado
exports.getCitasPorPaciente = async (req, res) => {
  try {
    const pacienteObjectId = new ObjectId(req.user.id);

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
    console.error('Error en getCitasPorPaciente:', error);
    res.status(500).json({ message: 'Error al obtener citas del paciente', error });
  }
};

// Crear nueva cita
exports.crearCita = async (req, res) => {
  try {
    const nuevaCita = new Cita({
      paciente_id: req.body.paciente_id,
      medico_id: req.body.medico_id,
      fecha_hora: req.body.fecha_hora,
      duracion: req.body.duracion,
      estado: req.body.estado || 'pendiente',
      tipo_cita: req.body.tipo_cita,
      especialidad: req.body.especialidad,
      notas: req.body.notas,
      sintomas: req.body.sintomas,
      creado_por: req.user.id,
      creado_en: new Date()
    });

    const citaGuardada = await nuevaCita.save();
    res.status(201).json(citaGuardada);
  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ mensaje: 'Error al crear la cita', error });
  }
};

// Editar cita existente
exports.editarCita = async (req, res) => {
  try {
    const citaId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(citaId)) {
      return res.status(400).json({ mensaje: 'ID de cita inválido' });
    }

    const datosActualizados = req.body;

    if (datosActualizados.fecha_hora) {
      datosActualizados.fecha_hora = new Date(datosActualizados.fecha_hora);
      if (isNaN(datosActualizados.fecha_hora.getTime())) {
        return res.status(400).json({ mensaje: 'Formato de fecha inválido' });
      }
    }

    datosActualizados.actualizado_en = new Date();

    console.log('Editar cita:', citaId, datosActualizados);  // <-- Aquí

    const citaEditada = await Cita.findByIdAndUpdate(citaId, datosActualizados, { new: true });

    if (!citaEditada) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }

    res.json(citaEditada);
  } catch (error) {
    console.error('Error al editar cita:', error);
    res.status(500).json({ mensaje: 'Error al editar la cita', error });
  }
};



// Eliminar cita
exports.eliminarCita = async (req, res) => {
  try {
    const citaId = req.params.id;

    const citaEliminada = await Cita.findByIdAndDelete(citaId);

    if (!citaEliminada) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }

    res.json({ mensaje: 'Cita eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    res.status(500).json({ mensaje: 'Error al eliminar la cita', error });
  }
};
