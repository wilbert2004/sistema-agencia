const express = require("express");
const usuariosController = require("./usuarios.controller");

const router = express.Router();

//esta ruta sirva para obtener todos los usuarios de la base de datos
router.get("/", usuariosController.obtenerUsuarios);
//esta ruta sirve para un usuario por su id
router.get("/:id", usuariosController.obtenerUsuarioPorId);
//esta ruta sirve para crear un usuario en la base de datos
router.post("/", usuariosController.crearUsuario);

module.exports = router;
