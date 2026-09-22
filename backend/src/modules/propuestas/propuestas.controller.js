//importamos el servicio de propuestas
const propuestasService = require("./propuestas.service");

//funcion para obtener todas las propuestas
async function obtenerPropuestas(req, res) {
  try {
    const resultado = await propuestasService.obtenerPropuestas();
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener propuestas:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}
//funcion para obtener una propuesta por id
async function obtenerPropuestaPorId(req, res) {
  try {
    const id = Number(req.params.id);
    const resultado = await propuestasService.obtenerPropuestaPorId(id);

    if (!resultado.success) {
      return res.status(404).json(resultado);
    }
    //returnamos la propuesta encontrada
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener propuesta por id:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

async function crearPropuesta(req, res) {
  try {
    const { idCliente, nombre, descripcion, fechaVencimiento } = req.body;

    const resultado = await propuestasService.crearPropuesta({
      idCliente,
      nombre,
      descripcion,
      fechaVencimiento,
    });

    if (!resultado.success) {
      return res.status(404).json(resultado);
    }

    return res.status(201).json(resultado);
  } catch (error) {
    console.error("Error al crear propuesta:", error);

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}

//funcion para actualizar una propuesta
async function actualizarPropuesta(req, res) {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion, fechaVencimiento, estado } = req.body;

    const resultado = await propuestasService.actualizarPropuesta(id, {
      nombre,
      descripcion,
      fechaVencimiento,
      estado,
    });

    //si no se pudo actualizar la propuesta
    if (!resultado.success) {
      return res.status(404).json(resultado);
    }

    //retornamos la propuesta actualizada
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al actualizar propuesta:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//funcion para eliminar una propuesta
async function eliminarPropuesta(req, res) {
  try {
    //obtenemos el id de la propuesta a eliminar
    const id = Number(req.params.id);

    const resultado = await propuestasService.eliminarPropuesta(id);

    //verificamos que la propuestas si se encuentra
    if (!resultado.success) {
      if (resultado.message === "propuesta no encontrada") {
        return res.status(404).json(resultado);
      }
      return res.status(400).json(resultado);
    }
    //retornamos la propuesta eliminada
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al eliminar propuesta:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//expportamos las funciones del controlador de propuestas
module.exports = {
  obtenerPropuestas,
  obtenerPropuestaPorId,
  crearPropuesta,
  actualizarPropuesta,
  eliminarPropuesta,
};
