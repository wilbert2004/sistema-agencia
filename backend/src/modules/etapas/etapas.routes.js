//importamos exprees
const express = require("express");
//importamos el controlador de etapas
const etapasController = require("./etapas.controller");
//importamos la validacion de etapas
const {
  ValidadEtapas,
  ValidadEtapaId,
  validarCrearEtapa,
  validarActualizarEtapa,
  validarEliminarEtapa,
} = require("./etapas.validation");

//envolvemos el router de express
const router = express.Router();

//esta ruta sirve para obtener todas las etapas de la base de datos
router.get("/", ValidadEtapas, etapasController.obtenerEtapas);

//esta ruta sirve para obtener una etapa por su id
router.get("/:id", ValidadEtapaId, etapasController.obtenerEtapaPorId);

//esta ruta sirve para crear una etapa en la base de datos
router.post("/", validarCrearEtapa, etapasController.crearEtapa);

//esta ruta sirve para actualizar una etapa en la base de datos
router.put(
  "/:id",
  ValidadEtapaId,
  validarActualizarEtapa,
  etapasController.actualizarEtapa,
);

//esta ruta sirve para eliminar una etapa en la base de datos
router.delete(
  "/:id",
  ValidadEtapaId,
  validarEliminarEtapa,
  etapasController.eliminarEtapa,
);

//exportamos el router de etapas
module.exports = router;
