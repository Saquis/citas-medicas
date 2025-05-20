require('dotenv').config();
const mongoose = require('mongoose');

console.log("Intentando conectar a:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Conexión exitosa");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Error:", err.message);
    process.exit(1);
  });