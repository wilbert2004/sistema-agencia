//importamos exprees
const express = require("express");
//importamos el controlador de propuesta detalle
const propuestaDetalleController = require("./propuesta-detalle.controller");
//importamos las validaciones de propuesta detalle
const {
  validarPropuestaDetalle,
  validarPropuestaDetallePorId,
  validarCrearPropuestaDetalle,
  validarActualizarPropuestaDetalle,
  validarEliminarPropuestaDetalle,
} = require("./propuesta-detalle.validation");

//envolvemos el router de express
const router = express.Router();

//esta ruta sirve para obtener todos los detalles de las propuestas
router.get(
  "/",
  validarPropuestaDetalle,
  propuestaDetalleController.obtenerPropuestasDetalles,
);

//fuincion para obtener un detalle de propuesta por id
router.get(
  "/:id",
  validarPropuestaDetallePorId,
  propuestaDetalleController.obtenerPropuestaDetallePorId,
);

//funcion para crear un detalle de propuesta
router.post(
  "/",
  validarCrearPropuestaDetalle,
  propuestaDetalleController.crearPropuestaDetalle,
);

//funcion para actualizar un detalle de propuesta
router.put(
  "/:id",
  validarActualizarPropuestaDetalle,
  propuestaDetalleController.actualizarPropuestaDetalle,
);

//funcion para eliminar un detalle de propuesta
router.delete(
  "/:id",
  validarEliminarPropuestaDetalle,
  propuestaDetalleController.eliminarPropuestaDetalle,
);

//exportamos el router de propuesta detalle
module.exports = router;
