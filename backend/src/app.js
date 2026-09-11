//importamos express
const express = require("express");
//importamos cors
const cors = require("cors");
const usuariosRoutes = require("./modules/usuarios/usuarios.routes");
//importamos las rutas de roles
const rolesRoutes = require("./modules/roles/roles.routes");
//importamos las rutas de clientes
const clientesRoutes = require("./modules/clientes/clientes.routes");
//importamos las rutas de trabajadores
const trabajadoresRoutes = require("./modules/trabajadores/trabajadores.routes");

//crearemos la app para el exprees
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/trabajadores", trabajadoresRoutes);

//importamos las rutas
app.get("/", (req, res) => {
  res.json({
    mensaje: "API de sistema-agencia funcionando",
  });
});

module.exports = app;
