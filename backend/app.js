const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log(" Conectado a MongoDB"))
  .catch((err) => console.error(" Error al conectar a MongoDB:", err));

// Importar Rutas
const rutasusuarios = require("./rutas/UsuariosR");
const rutasCitas = require("./rutas/CitasR"); // Añadir esta línea
const pacientesR = require('./rutas/PacientesR');
app.use("/api", rutasusuarios); // Rutas para usuarios
app.use("/api", rutasCitas); // Añadir esta línea
app.use('/api/pacientes', pacientesR);

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("API de citas médicas funcionando");
});

// Iniciar servidor
app.listen(process.env.PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${process.env.PORT}`);
});