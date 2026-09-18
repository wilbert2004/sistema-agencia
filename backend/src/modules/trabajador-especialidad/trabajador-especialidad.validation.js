//crearemos la validacion para trabajador-especialidad

function validarTrabajadorEspecialidad(req, res, next) {
  next();
}

//validacion exclusiva para operaciones
function validarObtenerTrabajadorEspecialidad(req, res, next) {
  //primero el campo de trabajadorId
  const idTrabajador = Number(req.params.trabajadorId);
  //segundo el camppo de especialidadId
  const idEspecialidad = Number(req.params.especialidadId);

  //validamos que el id de trabajador sea un numero entero positivo
  if (!Number.isInteger(idTrabajador) || idTrabajador <= 0) {
    return res.status(400).json({
      success: false,
      message: "El ID del trabajador debe ser un número entero positivo",
    });
  }
  //validamos que el id de especialidad sea un numero entero positivo
  if (!Number.isInteger(idEspecialidad) || idEspecialidad <= 0) {
    return res.status(400).json({
      success: false,
      message: "El ID de la especialidad debe ser un número entero positivo",
    });
  }

  //si todo bien llamamos al next
  next();
}

//funcion para un post de trabajador-especialidad
function validarCrearTrabajadorEspecialidad(req, res, next) {
  //obtenemos los id de trabajador y especialidad
  const { idTrabajador, idEspecialidad } = req.body;

  //verificamos que el id de trabajador no este indefinido
  if (idTrabajador === undefined) {
    return res.status(400).json({
      success: false,
      message: "El ID del trabajador es obligatorio",
    });
  }

  //verificamos que el id de especialidad no este indefinido
  if (idEspecialidad === undefined) {
    return res.status(400).json({
      success: false,
      message: "El ID de la especialidad es obligatorio",
    });
  }

  //validamos que el id de trabajador sea un numero entero positivo
  const trabajador = Number(idTrabajador);
  const especialidad = Number(idEspecialidad);
  if (!Number.isInteger(trabajador) || trabajador <= 0) {
    return res.status(400).json({
      success: false,
      message: "El ID del trabajador debe ser un número entero positivo",
    });
  }
  //validamos que el id de especialidad sea un numero entero positivo
  if (!Number.isInteger(especialidad) || especialidad <= 0) {
    return res.status(400).json({
      success: false,
      message: "El ID de la especialidad debe ser un número entero positivo",
    });
  }
  //si todo bien llamamos al next
  next();
}

//funcion para delete de trabajador-especialidad
function validarEliminarTrabajadorEspecialidad(req, res, next) {
  const idTrabajador = Number(req.params.trabajadorId);
  const idEspecialidad = Number(req.params.especialidadId);

  //validamos que el id de trabajador sea un numero entero positivo
  if (!Number.isInteger(idTrabajador) || idTrabajador <= 0) {
    return res.status(400).json({
      success: false,
      message: "El ID del trabajador debe ser un número entero positivo",
    });
  }

  //validamos que el id de especialidad sea un numero entero positivo
  if (!Number.isInteger(idEspecialidad) || idEspecialidad <= 0) {
    return res.status(400).json({
      success: false,
      message: "El ID de la especialidad debe ser un número entero positivo",
    });
  }

  //si todo bien llamamos al next
  next();
}

//exportamos
module.exports = {
  validarTrabajadorEspecialidad,
  validarObtenerTrabajadorEspecialidad,
  validarCrearTrabajadorEspecialidad,
  validarEliminarTrabajadorEspecialidad,
};
