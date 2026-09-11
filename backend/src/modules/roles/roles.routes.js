const express = require("express");
const rolesController = require("./roles.controller");

const router = express.Router();

//esta ruta sirve para obtener todos los roles de la base de datos
router.get("/", rolesController.obtenerRoles);
//esta ruta sirve para obtener un rol por su id
router.get("/:id", rolesController.obtenerRolPorId);
//esta ruta sirve para crear un rol en la base de datos
router.post("/", rolesController.crearRol);
//esta ruta sirve para actualizar un rol en la base de datos
router.put("/:id", rolesController.actualizarRol);
//esta ruta sirve para eliminar un rol en la base de datos
router.delete("/:id", rolesController.eliminarRol);

module.exports = router;
