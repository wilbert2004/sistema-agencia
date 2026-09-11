//obtenemos los servicios de clientes
const trabajadoresService = require("./trabajadores.service");

//funcion para obtener los trabajadores de la base de datos
async function obtenerTrabajadores(req, res) {
  try {
    const trabajadores = await trabajadoresService.obtenerTrabajadores();
    res.status(200).json({ success: true, data: trabajadores });
  } catch (error) {
    console.error = new Error("Error al obtener trabajadores");
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}

//obtener un trabajador por su id
async function obtenerTrabajadorPorId(req, res) {
  try {
    const id = parseInt(req.params.id);
    const trabajador = await trabajadoresService.obtenerTrabajadorPorId(id);

    //si no se encuentra el trabajador
    if (!trabajador) {
      return res.status(404).json({
        success: false,
        mensaje: "Trabajador no encontrado",
      });
    }

    //si se encuentra el trabajador
    res.status(200).json({ success: true, data: trabajador });
  } catch (error) {
    console.error = new Error("Error al obtener trabajador por ID", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}

//funcion para crear un trabajador
async function crearTrabajador(req, res) {
  try {
    const trabajador = await trabajadoresService.crearTrabajador(req.body);
    //mandamos el 201 con exito
    res.status(201).json({
      success: true,
      data: trabajador,
      message: "Trabajador creado exitosamente",
    });
  } catch (error) {
    console.error("Error al crear trabajador:", error);

    if (error.message === "Usuario no encontrado") {
      return res.status(404).json({
        success: false,
        mensaje: "Usuario no encontrado",
      });
    }

    if (error.message === "Usuario no es un trabajador") {
      return res.status(400).json({
        success: false,
        mensaje: "El usuario no tiene asignado el rol de trabajador (idRol: 2)",
      });
    }

    if (error.message === "Usuario inactivo") {
      return res.status(400).json({
        success: false,
        mensaje: "Usuario inactivo",
      });
    }

    if (error.message === "trabajador ya existe") {
      return res.status(400).json({
        success: false,
        mensaje: "Trabajador ya existe",
      });
    }

    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}
//expotar
module.exports = {
  obtenerTrabajadores,
  obtenerTrabajadorPorId,
  crearTrabajador,
};
