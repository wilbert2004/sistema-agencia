const proyectosService = require("./proyectos.service");

//funcion para obtener todos los proyectos
async function obtenerProyectos(req, res) {
  try {
    const result = await proyectosService.obtenerProyectos();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener los proyectos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los proyectos",
      error: error.message,
    });
  }
}

//funcionpara obtener un proyecto por id
async function obtenerProyectoPorId(req, res) {
  try {
    //obtenemos el id del proyecto
    const id = Number(req.params.id);

    //llamamos al servicio para obtener el proyecto por id
    const resultado = await proyectosService.obtenerProyectoPorId(id);

    //si el proyecto no existe, devolvemos un error
    if (!resultado.success) {
      return res.status(404).json(resultado);
    }

    //si el proyecto existe, devolvemos el proyecto
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener el proyecto por id:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el proyecto por id",
      error: error.message,
    });
  }
}

//funcion para crear un proyecto
async function crearProyecto(req, res) {
  try {
    const {
      idCliente,
      idPropuesta,
      nombreProyecto,
      descripcion,
      fechaInicio,
      fechaFinEstimada,
    } = req.body;

    const resultado = await proyectosService.crearProyecto({
      idCliente,
      idPropuesta,
      nombreProyecto,
      descripcion,
      fechaInicio,
      fechaFinEstimada,
    });

    if (!resultado.success) {
      return res.status(resultado.status || 400).json({
        success: false,
        message: resultado.message,
      });
    }

    return res.status(201).json(resultado);
  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear el proyecto",
      error: error.message,
    });
  }
}

//funcion para actualizar un proyecto
async function actualizarProyecto(req, res) {
  try {
    const id = Number(req.params.id);

    const {
      nombreProyecto,
      descripcion,
      fechaInicio,
      fechaFinEstimada,
      estado,
    } = req.body;

    const resultado = await proyectosService.actualizarProyecto(id, {
      nombreProyecto,
      descripcion,
      fechaInicio,
      fechaFinEstimada,
      estado,
    });

    if (!resultado.success) {
      return res.status(resultado.status || 400).json({
        success: false,
        message: resultado.message,
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al actualizar proyecto:", error);

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}

//funcion para eliminar un proyecto
async function eliminarProyecto(req, res) {
  try {
    const id = Number(req.params.id);

    const resultado = await proyectosService.eliminarProyecto(id);

    if (!resultado.success) {
      return res.status(resultado.status || 400).json({
        success: false,
        message: resultado.message,
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al eliminar proyecto:", error);

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}
//exportar las funciones del controlador
module.exports = {
  obtenerProyectos,
  obtenerProyectoPorId,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto,
};
