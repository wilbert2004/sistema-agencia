//express
const express = require("express");
//importamos el controlador de proyecto-servicio
const proyectoServicioController = require("./proyecto-servicio.controller");
//importamos las validaciones de proyecto-servicio
const {
  validarProyecto,
  validarProyectoPorId,
  validarCrearProyectoServicio,
  validarActualizarProyectoServicio,
  validarEliminarProyectoServicio,
} = require("./proyecto-servicio.validation");

//creamos el router de express
const router = express.Router();

//esta ruta sirve para obtener todos los proyectos vinculados con servicio
router.get(
  "/",
  validarProyecto,
  proyectoServicioController.obtenerProyectoServicio,
);

//esta ruta sirve para obtener los proyectos vinculados con servicio por id
router.get(
  "/:idProyecto/:idServicio",
  validarProyectoPorId,
  proyectoServicioController.obtenerProyectoServicioPorId,
);

//esta ruta sirve para crear un proyecto vinculado con servicio
router.post(
  "/",
  validarCrearProyectoServicio,
  proyectoServicioController.crearProyectoServicio,
);

//esta ruta sirve para actualizar un proyecto vinculado con servicio
router.put(
  "/:idProyecto/:idServicio",
  validarActualizarProyectoServicio,
  proyectoServicioController.actualizarProyectoServicio,
);

//esta ruta sirve para eliminar un proyecto vinculado con servicio
router.delete(
  "/:idProyecto/:idServicio",
  validarEliminarProyectoServicio,
  proyectoServicioController.eliminarProyectoServicio,
);

//exportamos el router de proyecto-servicio
module.exports = router;
