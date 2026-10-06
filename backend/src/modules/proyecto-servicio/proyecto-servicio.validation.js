//funcion para moostrar todo los proyectos vinculados con servicio
function validarProyecto(req, res, next) {
  next();
}

//funcion para mostrar lso proyectso con servciicos por id
function validarProyectoPorId(req, res, next) {
  //hacemos un request de cada id de proyecto y servicio para validar que existan en la base de datos
  const idProyecto = Nunmber(req.params.idProyecto);
  const idServicio = Number(req.params.idServicio);

  //verificamos que el poroyecto sea un numero y que sea mayor a 0
  if (!Number.isInteger(idProyecto) || idProyecto <= 0) {
    return res.status(400).json({
      success: false,
      message: "El id del proyecto debe ser un número mayor a 0",
    });
  }

  //verificamos que el servicio sea un numero y que sea mayor a 0
  if (!Number.isInteger(idServicio) || idServicio <= 0) {
    return res.status(400).json({
      success: false,
      message: "El id del servicio debe ser un número mayor a 0",
    });
  }

  next();
}

//funcion para crear un proyecto vinculado con servicio
function validarCrearProyectoServicio(req, res, next) {
  const { idProyecto, idServicio, cantidad, precioAcordado } = req.body;

  //verificamos que el id del proyecto sea un numero y que sea mayor a 0
  if (!Number.isInteger(idProyecto) || idProyecto <= 0) {
    return res.status(400).json({
      success: false,
      message: "El id del proyecto debe ser un número mayor a 0",
    });
  }

  //verificamos que el id del servicio sea un numero y que sea mayor a 0
  if (!Number.isInteger(idServicio) || idServicio <= 0) {
    return res.status(400).json({
      success: false,
      message: "El id del servicio debe ser un número mayor a 0",
    });
  }

  if (cantidad === undefined || !Number.isInteger(cantidad) || cantidad <= 0) {
    return res.status(400).json({
      success: false,
      message: "La cantidad debe ser un número entero mayor a 0",
    });
  }

  if (
    precioAcordado === undefined ||
    typeof precioAcordado !== "number" ||
    precioAcordado < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "El precio acordado debe ser un número mayor o igual a 0",
    });
  }

  next();
}

//funcion para actualizar un proyecto vinculado con servicio
function validarActualizarProyectoServicio(req, res, next) {
  const { cantidad, precioAcordado } = req.body;

  if (cantidad === undefined && precioAcordado === undefined) {
    return res.status(400).json({
      success: false,
      message: "Debe proporcionar al menos un campo para actualizar",
    });
  }

  if (cantidad !== undefined) {
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(400).json({
        success: false,
        message: "La cantidad debe ser un entero mayor a 0",
      });
    }
  }

  if (precioAcordado !== undefined) {
    if (
      typeof precioAcordado !== "number" ||
      !Number.isFinite(precioAcordado) ||
      precioAcordado < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "El precioAcordado debe ser un número mayor o igual a 0",
      });
    }
  }

  next();
}

//funcion para eliminar un proyecto vinculado con servicio
function validarEliminarProyectoServicio(req, res, next) {
  const idProyecto = Number(req.params.idProyecto);
  const idServicio = Number(req.params.idServicio);

  if (!Number.isInteger(idProyecto) || idProyecto <= 0) {
    return res.status(400).json({
      success: false,
      message: "El idProyecto debe ser un entero positivo",
    });
  }

  if (!Number.isInteger(idServicio) || idServicio <= 0) {
    return res.status(400).json({
      success: false,
      message: "El idServicio debe ser un entero positivo",
    });
  }

  next();
}
//exportacion de modules
module.exports = {
  validarProyecto,
  validarProyectoPorId,
  validarCrearProyectoServicio,
  validarActualizarProyectoServicio,
  validarEliminarProyectoServicio,
};
