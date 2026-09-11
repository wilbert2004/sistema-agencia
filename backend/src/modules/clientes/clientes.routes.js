//imporetamos exprees
const express = require("express");
//importamos el controlador de clientes
const clientesController = require("./clientes.controller");

//validation de get
const {
  validarObtenerclientes,
  validarObtenerClientesId,
  validarCrearCliente,
} = require("./clientes.validation");

//creamos el router de express
const router = express.Router();

//esta ruta sirve para obtener todos los clientes de la base de datos
router.get(
  "/",
  validarObtenerclientes,
  clientesController.obtenerTodosclientes,
);

//esta ruta sirve para obtener un cliente por su id
router.get(
  "/:id",
  validarObtenerClientesId,
  clientesController.obtenerClientePorId,
);

//esta ruta sirve para crear un cliente
router.post("/", validarCrearCliente, clientesController.crearCliente);

//esta ruta sirve para actualizar un cliente
router.put(
  "/:id",
  validarObtenerClientesId,
  clientesController.actualizarCliente,
);
//esta ruta sirve para eliminar un cliente
router.delete(
  "/:id",
  validarObtenerClientesId,
  clientesController.eliminarCliente,
);

//exportamos el router
module.exports = router;
