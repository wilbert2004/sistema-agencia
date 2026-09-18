//obtenemos los servicios de especialidades
const especialidadesService = require("./especialidades.service");

//funcion para obtener todas las especialidades de la base de datos
async function obtenerEspecialidades(req, res) {
  try {
    const especialidades = await especialidadesService.obtenerEspecialidades();
    res.status(200).json({ success: true, data: especialidades });
  } catch (error) {
    console.error("Error al obtener especialidades:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//funcion para obtener una especialidad por su id
async function obtenerEspecialidadPorId(req, res) {
  try {
    //obtenemos el id de la especialidad
    const id = Number(req.params.id);

    //validamos que el id sea un numero entero positivo
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "El ID de la especialidad debe ser un número entero positivo",
      });
    }
    //obtenemos la especialidad por su id
    const especialidad =
      await especialidadesService.obtenerEspecialidadPorId(id);

    //si no hay una especialidad que nos mande un error 404 no encontrado
    if (!especialidad) {
      return res.status(404).json({
        success: false,
        message: "Especialidad no encontrada",
      });
    }
    ///si no que me mande el response de mi bd
    return res.status(200).json({ success: true, data: especialidad });
  } catch (error) {
    //si hay un error lo mostramos en consola y mandamos un error 500
    console.error("Error al obtener especialidad:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//funcion para crear una especialidad
async function crearEspecialidad(req, res) {
  try {
    //obtenemos el nombre de la especialidad del body
    const { nombreEspecialidad } = req.body;

    //llamamos a la funcion de crear especialidad del service
    const resultado =
      await especialidadesService.crearEspecialidad(nombreEspecialidad);

    //si el resultado es success false mandamos un error 400
    if (!resultado.success) {
      return res.status(400).json(resultado);
    }
    //si no mandamos un success true y un mensaje de que se creo la especialidad
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al crear especialidad:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//funcion para actualizar una especialidad
async function actualizarEspecialidad(req, res) {
  try {
    //obtenemos el id de la especialidad
    const id = Number(req.params.id);
    //obtenemos el nombre de la especialidad del body
    const { nombreEspecialidad } = req.body;

    const resultado = await especialidadesService.actualizarEspecialidad(
      id,
      nombreEspecialidad,
    );

    //conicion de verificar si se encuentra la especialidad
    if (!resultado.success) {
      if (resultado.message === "La especialidad no existe") {
        return res.status(400).json(resultado);
      }
      return res.status(400).json(resultado);
    }

    //si todo bien mandamos un success true y un mensaje de que se actualizo la especialidad
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al actualizar especialidad:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//funcion para eliminar una especialidad
async function eliminarEspecialidad(req, res) {
  try {
    //obtenemos el id de la especialidad
    const id = Number(req.params.id);
    const resultado = await especialidadesService.eliminarEspecialidad(id);

    //conicion de verificar si se encuentra la especialidad
    if (!resultado.success) {
      if (resultado.message === "La especialidad no existe") {
        return res.status(400).json(resultado);
      }
      return res.status(400).json(resultado);
    }

    //si todo bien mandamos un success true y un mensaje de que se elimino la especialidad
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al eliminar especialidad:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//exportamos las funciones
module.exports = {
  obtenerEspecialidades,
  obtenerEspecialidadPorId,
  crearEspecialidad,
  actualizarEspecialidad,
  eliminarEspecialidad,
};
