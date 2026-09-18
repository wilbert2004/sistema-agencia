//crearemos express
const express = require("express");

//agregamos el controlador de trabajador-especialidad
const trabajadorEspecialidadController = require("./trabajador-especialidad.controller");

//agregamos la validacion de trabajador-especialidad
const {
  validarTrabajadorEspecialidad,
  validarObtenerTrabajadorEspecialidad,
  validarCrearTrabajadorEspecialidad,
  validarEliminarTrabajadorEspecialidad,
} = require("./trabajador-especialidad.validation");

//crearemos la ruta de express
const router = express.Router();

//api get de trabajador-especialidad
router.get(
  "/",
  validarTrabajadorEspecialidad,
  trabajadorEspecialidadController.obtenerTrabajadorEspecialidad,
);

//api get de trabajador-especialidad por id
router.get(
  "/:trabajadorId/:especialidadId",
  validarObtenerTrabajadorEspecialidad,
  trabajadorEspecialidadController.obtenerTrabajadorEspecialidadPorId,
);

//api post de trabajador-especialidad
router.post(
  "/",
  validarCrearTrabajadorEspecialidad,
  trabajadorEspecialidadController.crearTrabajadorEspecialidad,
);

//api delete de trabajador-especialidad
router.delete(
  "/:trabajadorId/:especialidadId",
  validarEliminarTrabajadorEspecialidad,
  trabajadorEspecialidadController.eliminarTrabajadorEspecialidad,
);
//exportamos el router
module.exports = router;
