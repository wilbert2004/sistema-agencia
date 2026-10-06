//funcion para validar los datos de la propuesta detalle
function validarPropuestaDetalle(req, res, next) {
  //no hay muchas condiciones
  next();
}

//funcion para validar los datos de la propuesta detalle por id
function validarPropuestaDetallePorId(req, res, next) {
  //el red body debe tener un id
  const id = Number(req.params.id);

  //validamos si es number
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message:
        "El id de la propuesta detalle debe ser un número entero positivo",
    });
  }
  next();
}

//funcion para validar los datos de la propuesta detalle al crear
function validarCrearPropuestaDetalle(req, res, next) {
  const { idPropuesta, idServicio, cantidad, precioUnitario } = req.body;

  // validacion de propuestas
  if (!Number.isInteger(idPropuesta) || idPropuesta <= 0) {
    return res.status(400).json({
      success: false,
      message: "El idPropuesta debe ser un entero positivo",
    });
  }

  // idServicio validacion
  if (!Number.isInteger(idServicio) || idServicio <= 0) {
    return res.status(400).json({
      success: false,
      message: "El idServicio debe ser un entero positivo",
    });
  }

  // cantidad validacion
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return res.status(400).json({
      success: false,
      message: "La cantidad debe ser un entero positivo",
    });
  }

  // precioUnitario validacion
  if (
    typeof precioUnitario !== "number" ||
    !Number.isFinite(precioUnitario) ||
    precioUnitario < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "El precioUnitario debe ser un número mayor o igual a 0",
    });
  }

  next();
}

//funcion para actualizar los datos de la propuesta detalle al actualizar
function validarActualizarPropuestaDetalle(req, res, next) {
  const { cantidad, precioUnitario } = req.body;

  //validamos con condiciones
  if (cantidad === undefined && precioUnitario === undefined) {
    return res.status(400).json({
      success: false,
      message: "Debe proporcionar al menos cantidad o precioUnitario",
    });
  }

  //validamos que cantidad no sea indefinido
  if (cantidad !== undefined) {
    //validamos que cantidad sea un entero positivo
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(400).json({
        success: false,
        message: "La cantidad debe ser un entero positivo",
      });
    }
  }

  //validamos que precioUnitario no sea indefinido
  if (precioUnitario !== undefined) {
    //validamos que precioUnitario sea un numero mayor o igual a 0
    if (
      typeof precioUnitario !== "number" ||
      !Number.isFinite(precioUnitario) ||
      precioUnitario < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "El precioUnitario debe ser un número mayor o igual a 0",
      });
    }
  }

  next();
}

//funcion para eliminar los datos de la propuesta detalle al eliminar
function validarEliminarPropuestaDetalle(req, res, next) {
  //el red body debe tener un id
  const id = Number(req.params.id);

  //validamos si es number
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message:
        "El id de la propuesta detalle debe ser un número entero positivo",
    });
  }
  //si todo esta bien, pasamos al siguiente middleware
  next();
}
//exportamos la funcion
module.exports = {
  validarPropuestaDetalle,
  validarPropuestaDetallePorId,
  validarCrearPropuestaDetalle,
  validarActualizarPropuestaDetalle,
  validarEliminarPropuestaDetalle,
};
