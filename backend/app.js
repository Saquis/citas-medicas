const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log(" Conectado a MongoDB"))
  .catch((err) => console.error(" Error al conectar a MongoDB:", err));

// Importar Rutas
const rutasUsuarios = require("./rutas/UsuariosR");
const rutasCitas = require("./rutas/CitasR");
const rutasPacientes = require("./rutas/PacientesR");
const rutasMedicos = require("./rutas/MedicosR");
const rutasAuth = require("./rutas/AuthR"); // Nueva ruta para auth

// Usar Rutas
app.use("/api/login", rutasAuth);            // Ruta específica para login
app.use("/api/usuarios", rutasUsuarios);
app.use("/api/citas", rutasCitas);
app.use("/api/pacientes", rutasPacientes);
app.use("/api/medicos", rutasMedicos);

// Ruta de prueba
app.get("/", (req, res) => {
    res.send(" API de citas médicas funcionando correctamente");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
