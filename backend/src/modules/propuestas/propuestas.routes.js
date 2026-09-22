//importamo express
const express = require("express");
//importamos el controlador de propuestas
const propuestasController = require("./propuestas.controller");

//importamro las validaciones de propuestas
const {
  validarPropuesta,
  validarPropuestaPorId,
  validarCrearPropuesta,
  validarActualizarPropuesta,
  validarEliminarPropuesta,
} = require("./propuestas.validation");

//envolvemos el router de express
const router = express.Router();

//esta ruta sirve para obtener todas las propuestas de la base de datos
router.get("/", validarPropuesta, propuestasController.obtenerPropuestas);

//esta ruta sirve para obtener una propuesta por id
router.get(
  "/:id",
  validarPropuestaPorId,
  propuestasController.obtenerPropuestaPorId,
);

//esta ruta sirve para crear una propuesta
router.post("/", validarCrearPropuesta, propuestasController.crearPropuesta);

//esta ruta sirve para actualizar una propuesta
router.put(
  "/:id",
  validarPropuestaPorId,
  validarActualizarPropuesta,
  propuestasController.actualizarPropuesta,
);

//esta ruta sirve para eliminar una propuesta
router.delete(
  "/:id",
  validarEliminarPropuesta,
  propuestasController.eliminarPropuesta,
);

//exportamos el router de propuestas
module.exports = router;
