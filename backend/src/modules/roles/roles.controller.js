//importamos los services de roles
const rolesService = require("./roles.service");

//esta funcion nos sirve para obtener todos los roles de la base de datos
async function obtenerRoles(req, res) {
  try {
    const roles = await rolesService.obtenerRoles();
    return res.status(200).json({ success: true, data: roles });
  } catch (error) {
    console.error("Error al obtener roles:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//esta funcion nos sirve para obtener un rol por su id
async function obtenerRolPorId(req, res) {
  try {
    const id = Number(req.params.id);

    //validamos que el id sea un numero entero positivo
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "El ID del rol debe ser un número entero positivo",
      });
    }

    const rol = await rolesService.obtenerRolPorId(id);
    if (!rol) {
      return res.status(404).json({
        success: false,
        message: "Rol no encontrado",
      });
    }

    return res.status(200).json({ success: true, data: rol });
  } catch (error) {
    console.error("Error al obtener rol:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//esta funcion nos sirve para crear un rol en la base de datos
async function crearRol(req, res) {
  try {
    const rol = await rolesService.crearRol(req.body);
    // creado con 201
    return res
      .status(201)
      .json({ success: true, message: "Rol creado correctamente", data: rol });
  } catch (error) {
    console.error("Error al crear rol:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//esta funcion nos sirve para actualizar un rol en la base de datos
async function actualizarRol(req, res) {
  try {
    const id = Number(req.params.id);

    //validamos que el id sea un numero entero positivo
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "El ID del rol debe ser un número entero positivo",
      });
    }

    const rol = await rolesService.actualizarRol(id, req.body);

    //validamos que el rol exista
    if (!rol) {
      return res.status(404).json({
        success: false,
        message: "Rol no encontrado",
      });
    }

    //retornamos el rol actualizado
    return res.status(200).json({
      success: true,
      message: "Rol actualizado correctamente",
      data: rol,
    });
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//esta funcion nos sirve para eliminar un rol en la base de datos
async function eliminarRol(req, res) {
  try {
    const id = Number(req.params.id);

    //validamos que el id sea un numero entero positivo
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "El ID del rol debe ser un número entero positivo",
      });
    }

    //llamamos al service para eliminar el rol
    const rol = await rolesService.eliminarRol(id);

    //retornamos el rol eliminado
    return res.status(200).json({
      success: true,
      message: "Rol eliminado correctamente",
      data: rol,
    });
  } catch (error) {
    console.error("Error al eliminar rol:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//exportamos las funciones del controller
module.exports = {
  obtenerRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRol,
  eliminarRol,
};
