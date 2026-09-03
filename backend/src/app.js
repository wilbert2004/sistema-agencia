//importamos express
const express = require("express");
//importamos cors
const cors = require("cors");
const usuariosRoutes = require("./modules/usuarios/usuarios.routes");

//crearemos la app para el exprees
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use("/api/usuarios", usuariosRoutes);

//importamos las rutas
app.get("/", (req, res) => {
  res.json({
    mensaje: "API de sistema-agencia funcionando",
  });
});

module.exports = app;
