const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  paciente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  medico_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fecha_hora: { type: Date, required: true },
  duracion: { type: Number },
  estado: { type: String, enum: ['pendiente', 'confirmada', 'cancelada', 'completada', 'no_asistio'], required: true },
  tipo_cita: { type: String },
  especialidad: { type: String },
  notas: { type: String },
  sintomas: { type: String },
  creado_por: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  creado_en: { type: Date, required: true },
  actualizado_en: { type: Date },
  recordatorio_enviado: { type: Boolean, default: false }
});

// Índices
citaSchema.index({ paciente_id: 1, fecha_hora: 1 });
citaSchema.index({ medico_id: 1, fecha_hora: 1 });
citaSchema.index({ fecha_hora: 1 });
citaSchema.index({ estado: 1 });
citaSchema.index({ especialidad: 1 });

module.exports = mongoose.model('Cita', citaSchema);