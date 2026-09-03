const usuariosService = require("./usuarios.service");
//importamos el servicio de usuarios para poder utilizarlo en el controlador
const { validarCrearUsuario } = require("./usuarios.validation");

//esta funcion nos sirve para obtener todos los usuarios de la base de datos
async function obtenerUsuarios(req, res) {
  try {
    const usuarios = await usuariosService.obtenerUsuarios();
    res.json({ success: true, data: usuarios });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//esta funcion nos sirve para obtener un usuario por su id
async function obtenerUsuarioPorId(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "El ID del usuario debe ser un número entero positivo",
    });
  }

  try {
    const usuario = await usuariosService.obtenerUsuarioPorId(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.json({ success: true, data: usuario });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}
//esta funcion nos sirve para crear un usuario en la base de datos
async function crearUsuario(req, res) {
  try {
    //validamos los errores que puedan llegar
    const errores = validarCrearUsuario(req.body);
    if (errores.length > 0) {
      return res.status(400).json({
        success: false,
        errores,
      });
    }

    //creamos el usuario en la base de datos
    const nuevoUsuario = await usuariosService.crearUsuario(req.body);
    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      data: nuevoUsuario,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);

    //codigo 500 para errores internos del servidor
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Error interno del servidor",
    });
  }
}

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
};
