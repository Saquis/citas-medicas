const Cita = require('../modelos/CitaM');
require('../modelos/UsuarioM');


exports.obtenerCitasPorPaciente = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar citas filtrando por paciente_id y poblar datos de paciente y médico
    const citas = await Cita.find({ paciente_id: id })
      .populate('paciente_id', 'nombre correo') // traer solo nombre y correo del paciente
      .populate('medico_id', 'nombre especialidad'); // traer nombre y especialidad del médico

    res.json(citas);
  } catch (error) {
    console.error('Error al obtener citas por paciente:', error);
    res.status(500).json({ mensaje: 'Error al obtener citas del paciente' });
  }
};
