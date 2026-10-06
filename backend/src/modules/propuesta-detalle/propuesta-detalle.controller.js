//importamoc los servicio de propuesta detalle
const propuestaDetalleService = require("./propuesta-detalle.service");

//función para obtener todos los detalles de las propuestas
async function obtenerPropuestasDetalles(req, res) {
  try {
    const resultado = await propuestaDetalleService.obtenerPropuestasDetalles();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los detalles de las propuestas",
      error: error.message,
    });
  }
}

//función para obtener un detalle de propuesta por id
async function obtenerPropuestaDetallePorId(req, res) {
  try {
    const id = Number(req.params.id);
    const resultado =
      await propuestaDetalleService.obtenerPropuestasDetallePorId(id);

    if (!resultado.success) {
      return res.status(404).json(resultado);
    }

    //luego devolver el detalle obtenido
    res.status(200).json(resultado);
  } catch (error) {
    console.error("error al obtener detalle propuesta por id", error);
    return res.status(500).json({
      success: false,
      message: "Error interno al servidor",
    });
  }
}
//funcion para crear un detalle de propuesta
async function crearPropuestaDetalle(req, res) {
  try {
    //obtenemos los datos del body
    const { idPropuesta, idServicio, cantidad, precioUnitario } = req.body;

    //llamamos al servicio para crear el detalle de propuesta
    const resultado = await propuestaDetalleService.crearPropuestaDetalle({
      idPropuesta,
      idServicio,
      cantidad,
      precioUnitario,
    });
    //si no se pudo crear el detalle de propuesta

    if (!resultado.success) {
      return res.status(resultado.status || 400).json({
        success: false,
        message: resultado.message,
      });
    }

    //luego devolver el detalle creado
    res.status(201).json({
      success: true,
      message: "Detalle de propuesta creado correctamente",
      data: resultado.data,
    });
  } catch (error) {
    console.error("Error al crear detalle de propuesta:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al crear detalle de propuesta",
    });
  }
}

//funcion para actualizar un detalle de propuesta
async function actualizarPropuestaDetalle(req, res) {
  try {
    //obtenemos el id del detalle de propuesta a actualizar
    const id = Number(req.params.id);

    //obtenemos los datos del body
    const { cantidad, precioUnitario } = req.body;

    //llamamos al servicio para actualizar el detalle de propuesta
    const resultado = await propuestaDetalleService.actualizarPropuestaDetalle(
      id,
      {
        cantidad,
        precioUnitario,
      },
    );
    //si no se pudo actualizar el detalle de propuesta
    if (!resultado.success) {
      return res.status(resultado.status || 400).json({
        success: false,
        message: resultado.message,
      });
    }
    //luego devolver el detalle actualizado
    res.status(200).json({
      success: true,
      message: "Detalle de propuesta actualizado correctamente",
      data: resultado.data,
    });
  } catch (error) {
    console.error("Error al actualizar detalle de propuesta:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al actualizar detalle de propuesta",
    });
  }
}

//funcion para eliminar un detalle de propuesta
async function eliminarPropuestaDetalle(req, res) {
  try {
    //obtenemos el id del detalle de propuesta a eliminar
    const id = Number(req.params.id);

    const resultado =
      await propuestaDetalleService.eliminarPropuestaDetalle(id);

    //si no se pudo eliminar el detalle de propuesta
    if (!resultado.success) {
      return res.status(resultado.status || 400).json({
        success: false,
        message: resultado.message,
      });
    }

    //luego devolver el detalle eliminado
    res.status(200).json({
      success: true,
      message: "Detalle de propuesta eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar detalle de propuesta:", error);
    return {
      success: false,
      status: 500,
      message: "Error interno del servidor al eliminar detalle de propuesta",
    };
  }
}

//exportamos la funcion
module.exports = {
  obtenerPropuestasDetalles,
  obtenerPropuestaDetallePorId,
  crearPropuestaDetalle,
  actualizarPropuestaDetalle,
  eliminarPropuestaDetalle,
};
