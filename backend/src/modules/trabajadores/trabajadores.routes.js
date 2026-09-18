//express
const express = require("express");
//importamos el contradoalor de trabajadores
const trabajadoresController = require("./trabajadores.controller");

//importamos la validacion de trabajadores
const {
  ValidarObtenerTrabajadores,
  ValidarObtenerTrabajadorPorId,
  validarCrearTrabajador,
  validarActualizarTrabajador,
} = require("./trabajadores.validation");

//creamos el router de express
const router = express.Router();

//esta ruta sirve para obtener todos los trabajadores de la base de datos
router.get(
  "/",
  ValidarObtenerTrabajadores,
  trabajadoresController.obtenerTrabajadores,
);
//esta ruta sirve para obtener un trabajador por su id
router.get(
  "/:id",
  ValidarObtenerTrabajadorPorId,
  trabajadoresController.obtenerTrabajadorPorId,
);

//ruta para crear un trabajador
router.post(
  "/",
  validarCrearTrabajador,
  trabajadoresController.crearTrabajador,
);

//rura para actualizar un trabajador
router.put(
  "/:id",
  ValidarObtenerTrabajadorPorId,
  validarActualizarTrabajador,
  trabajadoresController.actualizarTrabajador,
);

//ruta para eliminar un trabajador
router.delete(
  "/:id",
  ValidarObtenerTrabajadorPorId,
  trabajadoresController.eliminarTrabajador,
);

//exportamos el router
module.exports = router;
