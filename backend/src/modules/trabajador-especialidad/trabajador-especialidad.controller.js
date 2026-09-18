//llamamos la funcion de service
const trabajadorEspecialidad = require("./trabajador-especialidad.service");

//crtearemos la funcion de obtener trabajador-especialidad
async function obtenerTrabajadorEspecialidad(req, res) {
  try {
    const resultado =
      await trabajadorEspecialidad.obtenerTrabajadorEspecialidad();
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener trabajador-especialidad:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//obtener trabajador-especialidad por id
async function obtenerTrabajadorEspecialidadPorId(req, res) {
  try {
    //obtenemos los id de trabajador y especialidad
    const idTrabajador = Number(req.params.trabajadorId);
    const idEspecialidad = Number(req.params.especialidadId);

    //llamamos a la funcion de service para obtener la relacion de trabajador-especialidad
    const resultado =
      await trabajadorEspecialidad.obtenerTrabajadorEspecialidad(
        idTrabajador,
        idEspecialidad,
      );

    //vericamos la condicion de success false para mandar un error 404
    if (!resultado.success) {
      return res.status(404).json(resultado);
    }

    //si todo bien mandamos un success true y un mensaje de que se obtuvo la relacion
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener trabajador-especialidad por id:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//funcion para crear la relacion de trabajador-especialidad
async function crearTrabajadorEspecialidad(req, res) {
  try {
    //variable para el id de trabajador y especialidad
    const idTrabajador = Number(req.body.idTrabajador);
    const idEspecialidad = Number(req.body.idEspecialidad);

    const resultado = await trabajadorEspecialidad.crearTrabajadorEspecialidad(
      idTrabajador,
      idEspecialidad,
    );

    //validacion de success false para mandar un error 400
    if (!resultado.success) {
      if (
        resultado.message === "El trabajador no existe" ||
        resultado.message === "El trabajador no esta activo"
      ) {
        return res.status(400).json(resultado);
      }

      if (
        resultado.message ===
        "El trabajador ya tiene asignada esta especialidad"
      ) {
        return res.status(400).json(resultado);
      }
      return res.status(400).json(resultado);
    }
    //si todo bien mandamos un success true y un mensaje de que se creo la relacion
    return res.status(201).json(resultado);
  } catch (error) {
    console.error("Error al crear trabajador-especialidad:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//funcion para eliminar la relacion de trabajador-especialidad
async function eliminarTrabajadorEspecialidad(req, res) {
  try {
    const idTrabajador = Number(req.params.trabajadorId);
    const idEspecialidad = Number(req.params.especialidadId);
    const resultado =
      await trabajadorEspecialidad.eliminarTrabajadorEspecialidad(
        idTrabajador,
        idEspecialidad,
      );

    //validacion de success false para mandar un error 404
    if (!resultado.success) {
      return res.status(404).json(resultado);
    }
    //si todo bien mandamos un success true y un mensaje de que se elimino la relacion
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al eliminar trabajador-especialidad:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}
//exportamos las funciones
module.exports = {
  obtenerTrabajadorEspecialidad,
  obtenerTrabajadorEspecialidadPorId,
  crearTrabajadorEspecialidad,
  eliminarTrabajadorEspecialidad,
};
