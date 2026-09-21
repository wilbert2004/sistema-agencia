//importamos el modulo de servicios de etapas
const etapasService = require("./etapas.service");

//funcion para obtener todas las etapas
async function obtenerEtapas(req, res) {
  try {
    const resultado = await etapasService.obtenerEtapas();
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener etapas:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//funcion para obtener una etapa por id
async function obtenerEtapaPorId(req, res) {
  try {
    const id = Number(req.params.id);
    const resultado = await etapasService.obtenerEtapaPorId(id);

    //vericamos la condicion de success false para mandar un error 404
    if (!resultado.success) {
      return res.status(404).json(resultado);
    }
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener etapa por id:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
}

//funcion para crear una etapa
async function crearEtapa(req, res) {
  try {
    const { nombreEtapa, descripcion } = req.body;
    const resultado = await etapasService.crearEtapa(nombreEtapa, descripcion);

    //verifcamos si el resultado es success false para mandar un error 400
    if (!resultado.success) {
      return res.status(400).json(resultado);
    }

    //si todo bien mandamos un success true y un mensaje de que se creo la etapa
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al crear etapa:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}

//funcion para actualizar una etapa
async function actualizarEtapa(req, res) {
  try {
    const id = Number(req.params.id);
    const { nombreEtapa, descripcion } = req.body;
    const resultado = await etapasService.actualizarEtapa(
      id,
      nombreEtapa,
      descripcion,
    );

    //verificamos si el resultado es success false para mandar un error 400
    if (!resultado.success) {
      if (resultado.message === "Etapa no encontrada") {
        return res.status(404).json(resultado);
      }

      if (resultado.message === "Ya existe otra etapa con ese nombre") {
        return res.status(409).json(resultado);
      }
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al actualizar etapa:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}

//funcion para eliminar una etapa
async function eliminarEtapa(req, res) {
  try {
    const id = Number(req.params.id);

    const resultado = await etapasService.eliminarEtapa(id);

    if (!resultado.success) {
      if (resultado.message === "Etapa no encontrada") {
        return res.status(404).json(resultado);
      }

      if (
        resultado.message ===
        "No se puede eliminar la etapa porque está siendo utilizada en un proyecto"
      ) {
        return res.status(400).json(resultado);
      }
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al eliminar etapa:", error);

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}

//exportamos las funciones de etapas
module.exports = {
  obtenerEtapas,
  obtenerEtapaPorId,
  crearEtapa,
  actualizarEtapa,
  eliminarEtapa,
};
