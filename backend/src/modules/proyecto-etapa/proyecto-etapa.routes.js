const express = require("express");

//importamos el controlador
const proyectoEtapaController = require("./proyecto-etapa.controller");

//importamos las validaciones de proyecto etapas
const {
  validarProyectoEtapas,
  validarProyectoEtapasId,
  validarCrearProyectoEtapa,
} = require("./proyecto-etapa.validation");

//crearemos la router de express
const router = express.Router();

//esta ruta sirve para obtener todos los proyectos vinculados con etapa
router.get(
  "/",
  validarProyectoEtapas,
  proyectoEtapaController.obtenerProyectoEtapas,
);

//esta ruta sirve para obtener un proyecto vinculado con etapa por id
router.get(
  "/:id",
  validarProyectoEtapasId,
  proyectoEtapaController.obtenerProyectoEtapaPorId,
);

//funcion para crear un proyecto vinculado con etapa
router.post(
  "/",
  validarCrearProyectoEtapa,
  proyectoEtapaController.crearProyectoEtapa,
);

//exportamos el router de proyecto-etapa
module.exports = router;
