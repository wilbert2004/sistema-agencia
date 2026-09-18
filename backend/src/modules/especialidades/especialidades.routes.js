//importamos express
const express = require("express");
//importamos el controlador de especialidades
const especialidadesController = require("./especialidades.controller");
//importamos la validacion de especialidades
const {
  validarObtenerEspecialidades,
  validarObtenerEspecialidadPorId,
  validarCrearEspecialidad,
  validarActualizarEspecialidad,
  validarEliminarEspecialidad,
} = require("./especialidades.validation");

//creamos el router de express
const router = express.Router();

//esta ruta sirve para obtener todas las especialidades de la base de datos
router.get(
  "/",
  validarObtenerEspecialidades,
  especialidadesController.obtenerEspecialidades,
);

//esta ruta sirve para obtener una especialidad por su id
router.get(
  "/:id",
  validarObtenerEspecialidadPorId,
  especialidadesController.obtenerEspecialidadPorId,
);

//esta ruta sirve para crear una especialidad
router.post(
  "/",
  validarCrearEspecialidad,
  especialidadesController.crearEspecialidad,
);

//esta ruta sirve para actualizar una especialidad
router.put(
  "/:id",
  validarActualizarEspecialidad,
  especialidadesController.actualizarEspecialidad,
);

//esta ruta sirve para eliminar una especialidad
router.delete(
  "/:id",
  validarEliminarEspecialidad,
  especialidadesController.eliminarEspecialidad,
);

//exportamos el router
module.exports = router;
