//funcion para validar los get
function validarProyectoEtapas(req, res, next) {
  next();
}

//funccion para validar los get id
function validarProyectoEtapasId(req, res, next) {
  const id = Number(req.params.id);

  //validamos que el id sea un numero y positivo
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensaje: "El id debe ser un numero entero positivo",
    });
  }

  //si todo esta bien, pasamos al siguiente middleware
  next();
}

//funcion para validar los post
function validarCrearProyectoEtapa(req, res, next) {
  const { idProyecto, idEtapa, fechaInicio, fechaFin } = req.body;

  //empezmaos a validar los datos
  if (!Number.isInteger(idProyecto) || idProyecto <= 0) {
    return res.status(400).json({
      mensaje: "El id del proyecto debe ser un numero entero positivo",
    });
  }

  //validamos el id de la etapa
  if (!Number.isInteger(idEtapa) || idEtapa <= 0) {
    return res.status(400).json({
      mensaje: "El id de la etapa debe ser un numero entero positivo",
    });
  }

  //validamos la fecha de inicio
  if (
    typeof fechaInicio !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(fechaInicio)
  ) {
    return res.status(400).json({
      success: false,
      message: "La fechaInicio debe tener el formato YYYY-MM-DD",
    });
  }

  //validamos la fecha de fin
  if (
    fechaFin !== undefined &&
    fechaFin !== null &&
    (typeof fechaFin !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fechaFin))
  ) {
    return res.status(400).json({
      success: false,
      message: "La fechaFin debe tener el formato YYYY-MM-DD",
    });
  }
  //validamos que la fecha de fin no sea menor a la fecha de inicio
  if (fechaFin && fechaFin < fechaInicio) {
    return res.status(400).json({
      success: false,
      message: "La fechaFin no puede ser anterior a la fechaInicio",
    });
  }

  next();
}

//exportamos la funcion
module.exports = {
  validarProyectoEtapas,
  validarProyectoEtapasId,
  validarCrearProyectoEtapa,
};
