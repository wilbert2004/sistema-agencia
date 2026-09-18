//exportamos express
const express = require("express");
//importamos el controlador de servicios
const serviciosController = require("./servicios.controller");
//importamos la validacion de servicios
const {
  obtenerServicios,
  obtenerServicioPorId,
  validarCrearServicio,
} = require("./servicios.validation");

//creamos el router de express
const router = express.Router();

//esta ruta sirve para obtener todos los servicios que ofrece la empresa
router.get("/", obtenerServicios, serviciosController.obtenerServicios);

//esta ruta sirve para obtener un servicio por su id
router.get(
  "/:id",
  obtenerServicioPorId,
  serviciosController.obtenerServicioPorId,
);

//esta ruta sirve para crear un servicio
router.post("/", validarCrearServicio, serviciosController.crearServicio);

//exportamos el router
module.exports = router;
