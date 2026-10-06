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
//importamos las rutas de especialidades
const especialidadesRoutes = require("./modules/especialidades/especialidades.routes");
//importamos las rutas de trabajador-especialidad
const trabajadorEspecialidadRoutes = require("./modules/trabajador-especialidad/trabajador-especialidad.routes");
//importamos las rutas de servicios
const serviciosRoutes = require("./modules/servicios/servicios.routes");
//importamos las rutas de etapas
const etapasRoutes = require("./modules/etapas/etapas.routes");
//importamos las rutas de propuestas
const propuestasRoutes = require("./modules/propuestas/propuestas.routes");

//importamos las rutas de propuesta detalle
const propuestaDetalleRoutes = require("./modules/propuesta-detalle/propuesta-detalle.routes");

//importamos las rutas de proyectos
const proyectosRoutes = require("./modules/proyectos/proyectos.routes");

//importamos las rutas de proyecto-servicio
const proyectoServicioRoutes = require("./modules/proyecto-servicio/proyecto-servicio.routes");

//crearemos la app para el exprees
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/trabajadores", trabajadoresRoutes);
app.use("/api/especialidades", especialidadesRoutes);
app.use("/api/trabajador-especialidad", trabajadorEspecialidadRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/etapas", etapasRoutes);
app.use("/api/propuestas", propuestasRoutes);
app.use("/api/propuestas-detalles", propuestaDetalleRoutes);
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/proyecto-servicio", proyectoServicioRoutes);
//importamos las rutas
app.get("/", (req, res) => {
  res.json({
    mensaje: "API de sistema-agencia funcionando",
  });
});

module.exports = app;
