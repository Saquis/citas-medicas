const Paciente = require('../modelos/PacienteM'); // Asegúrate que tienes el modelo PacienteM
const Cita = require('../modelos/CitaM'); // Asegúrate de importar el modelo de citas
// Obtener todos los pacientes
exports.obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find();
    res.json(pacientes);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener pacientes' });
  }
};

// Obtener un paciente por ID
exports.obtenerPacientePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const paciente = await Paciente.findById(id);
    if (!paciente) return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    res.json(paciente);
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    res.status(500).json({ mensaje: 'Error al obtener paciente' });
  }
};

// Crear un nuevo paciente
exports.crearPaciente = async (req, res) => {
  try {
    const nuevoPaciente = new Paciente(req.body);
    await nuevoPaciente.save();
    res.status(201).json(nuevoPaciente);
  } catch (error) {
    console.error('Error al crear paciente:', error);
    res.status(500).json({ mensaje: 'Error al crear paciente' });
  }
};

// Actualizar paciente
exports.actualizarPaciente = async (req, res) => {
  const { id } = req.params;
  try {
    const pacienteActualizado = await Paciente.findByIdAndUpdate(id, req.body, { new: true });
    if (!pacienteActualizado) return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    res.json(pacienteActualizado);
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(500).json({ mensaje: 'Error al actualizar paciente' });
  }
};

// Eliminar paciente (solo si no tiene citas)
exports.eliminarPaciente = async (req, res) => {
  const { id } = req.params;
  try {
    const tieneCitas = await Cita.exists({ paciente_id: id });
    if (tieneCitas) {
      return res.status(400).json({ mensaje: 'No se puede eliminar paciente con citas registradas' });
    }
    const eliminado = await Paciente.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    res.json({ mensaje: 'Paciente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    res.status(500).json({ mensaje: 'Error al eliminar paciente' });
  }
};

// Obtener citas por paciente
exports.obtenerCitasPorPaciente = async (req, res) => {
  const { id } = req.params;
  try {
    const citas = await Cita.find({ paciente_id: id });
    res.json(citas);
  } catch (error) {
    console.error('Error al obtener citas del paciente:', error);
    res.status(500).json({ mensaje: 'Error al obtener citas del paciente' });
  }
};
