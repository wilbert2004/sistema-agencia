//obtenemos los servicios de clientes
const clientesService = require("./clientes.service");
//importamos el servicio de validacion
const {
  validarObtenerclientes,
  validarObtenerClientesId,
} = require("./clientes.validation");

//funcion para obtener todos los clientes de la base de datos
async function obtenerTodosclientes(req, res) {
  try {
    const clientes = await clientesService.obtenerClientes();

    //y el interno 200 correcto
    return res.status(200).json({ success: true, data: clientes });
  } catch (error) {
    //si hay un error lo mostramos en consola y mandamos un error 500
    console.error("Error al obtener clientes:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//funcion para obtener un cliente por su id
async function obtenerClientePorId(req, res) {
  try {
    //validamos el id del cliente
    const id = Number(req.params.id);
    const cliente = await clientesService.obtenerClientePorId(id);

    //si no hya un cliente que nos mande un error 404 no encontrado
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    //si no que me mande el response de mi bd
    res.status(200).json({ success: true, data: cliente });
  } catch (error) {
    //si hay un error lo mostramos en consola y mandamos un error 500
    console.error("Error al obtener cliente:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//funcion para crear cliente con un metodo post
async function crearCliente(req, res) {
  try {
    const cliente = await clientesService.crearClientes(req.body);
    res.status(201).json({
      success: true,
      message: "Cliente creado exitosamente",
      data: cliente,
    });
  } catch (error) {
    //si hay un error lo mostramos en consola y mandamos un error 500
    console.error("Error al crear cliente:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//funcion para actualizar cliente con un metodo put
async function actualizarCliente(req, res) {
  try {
    const id = Number(req.params.id);
    //verifcamos que el clinete sea existente
    const clienteExistente = await clientesService.obtenerClientePorId(id);
    if (!clienteExistente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    //crearemos una variables [ata datos permitidos
    const datosPermitidos = {};

    //comdicion que si existe la empresa
    if (req.body.empresa !== undefined) {
      datosPermitidos.empresa = req.body.empresa;
    }
    //comdicion que si existe el telefono
    if (req.body.telefono !== undefined) {
      datosPermitidos.telefono = req.body.telefono;
    }
    //comdicion que si existe la direccion
    if (req.body.direccion !== undefined) {
      datosPermitidos.direccion = req.body.direccion;
    }

    //const cliente para actualizar el cliente
    const cliente = await clientesService.actualizarCliente(
      id,
      datosPermitidos,
    );
    res.status(200).json({
      success: true,
      message: "Cliente actualizado exitosamente",
      data: cliente,
    });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}
//funcion para eliminar cliente con un metodo delete
async function eliminarCliente(req, res) {
  try {
    //verificamos que el cliente exista
    const id = Number(req.params.id);
    //verificamos que el cliente exista\
    const cliente = await clientesService.elimarCliente(id);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }
    res.status(200).json({
      success: true,
      message: "Cliente desactivado exitosamente",
      data: cliente,
    });
  } catch (error) {
    console.error("Error al desactivar cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}
//exportamos los datos
module.exports = {
  obtenerTodosclientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
};
