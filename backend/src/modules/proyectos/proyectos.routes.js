//importamos exprees
const express = require("express");
//importamos el controlador de proyectos
const proyectosController = require("./proyectos.controller");
//importamos las validaciones de proyectos
const {
  validarProyecto,
  validarProyectoPorId,
  validarCreacionProyecto,
  validarActualizarProyecto,
  validarEliminarProyecto,
} = require("./proyectos.validation");

//envolvemos el router de express
const router = express.Router();

//esta ruta sirve para obtener todos los proyectos
router.get("/", validarProyecto, proyectosController.obtenerProyectos);

//esta ruta sirve para obtener un proyecto por id
router.get(
  "/:id",
  validarProyectoPorId,
  proyectosController.obtenerProyectoPorId,
);

//esta ruta sirve para crear un nuevo proyecto
router.post("/", validarCreacionProyecto, proyectosController.crearProyecto);

//esta ruta sirve para actualizar un proyecto por id
router.put(
  "/:id",
  validarProyectoPorId,
  validarActualizarProyecto,
  proyectosController.actualizarProyecto,
);

//esta ruta sirve para eliminar un proyecto por id
router.delete(
  "/:id",
  validarEliminarProyecto,
  proyectosController.eliminarProyecto,
);

//exportamos el router de proyectos
module.exports = router;
